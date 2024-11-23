import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { useRoute } from '@react-navigation/native';

export default function Follower() {
    const [follower, setFollower] = useState([]);
    const [otherPerson, setOtherPerson] = useState(null);
    const route = useRoute();

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchApi = async () => {
            let data;
            if (route.params.personId === user.userId) {
                data = user;
            } else {
                data = await dbApi.getUserData(route.params.personId);
                setOtherPerson(data);
            }

            const users = await Promise.all(data.followers.map((uid) => dbApi.getUserData(uid)));

            setFollower(users);
        };

        fetchApi();
    }, [user]);

    return (
        <View className="px-5 py-3">
            <View>
                {follower.length > 0 ? (
                    <>
                        {follower.map((user, index) => (
                            <UserCard key={index} isFriend otherPerson={otherPerson} {...user} />
                        ))}
                    </>
                ) : (
                    <Text className="text-center">Follow more people to make more follower.</Text>
                )}
            </View>
        </View>
    );
}
