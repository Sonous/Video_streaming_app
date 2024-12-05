import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Search from '../../components/Search';
import UserCard from '../../components/UserCard';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import useDebounce from '../../hooks/useDebounce';

export default function SuggestedFriend() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noFriendfollowers, setNoFriendFollowers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchApi = async () => {
            const filterFollowers = user.followers.filter((followerId) => !user.following.includes(followerId));

            const users = await Promise.all(filterFollowers.map((uid) => dbApi.getUserData(uid)));

            setNoFriendFollowers(users);
        };

        fetchApi();
    }, [user]);

    // Search
    const debouncedValue = useDebounce(searchValue, 1000);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setIsLoading(true);
                const users = await dbApi.getUserByName(debouncedValue, user?.userId);

                setSearchResults(users);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchApi();
    }, [debouncedValue]);

    return (
        <ScrollView>
            <View className="px-5 py-3 gap-5">
                <Search searchValue={searchValue} setSearchValue={setSearchValue} placeholder={'Search by name'} />
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <View className="gap-5">
                        <Text>{searchResults.length > 0 ? 'More friends' : 'Suggested accounts'}</Text>
                        <View className="gap-5">
                            {searchResults.length > 0 ? (
                                <>
                                    {searchResults.map((user, index) => (
                                        <UserCard key={index} {...user} noFriendfollowers={noFriendfollowers} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {noFriendfollowers.map((follower, index) => (
                                        <UserCard
                                            key={index}
                                            suggestedAccount
                                            noFriendfollowers={noFriendfollowers}
                                            {...follower}
                                        />
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
