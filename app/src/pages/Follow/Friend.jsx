import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { useRoute } from '@react-navigation/native';

export default function Friend() {
    const [friends, setFriends] = useState([]);
    const [otherPerson, setOtherPerson] = useState(null);

    const route = useRoute();

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchApi = async () => {
            let data = null;
            if (route.params.personId === user.userId) {
                data = user;
            } else {
                data = await dbApi.getUserData(route.params.personId);
                setOtherPerson(data);
            }

            const filterFollowers = data.followers.filter((followerId) => data.following.includes(followerId));

            const users = await Promise.all(filterFollowers.map((uid) => dbApi.getUserData(uid)));

            setFriends(users);
        };

        fetchApi();
    }, [user]);

    return (
        <ScrollView className="px-5 py-3">
            <View>
                {friends.length > 0 ? (
                    <>
                        {friends.map((user, index) => (
                            <UserCard key={index} isFriend otherPerson={otherPerson} {...user} />
                        ))}
                    </>
                ) : (
                    <Text className="text-center">Follow more people to make more friends.</Text>
                )}
            </View>
        </ScrollView>
    );
}
