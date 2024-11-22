import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { useRoute } from '@react-navigation/native';

export default function Following() {
    const [following, setFollowing] = useState([]);
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

            const users = await Promise.all(data.following.map((uid) => dbApi.getUserData(uid)));

            setFollowing(users);
        };

        fetchApi();
    }, [user]);

    return (
        <View className="px-5 py-3">
            <View>
                {following.length > 0 ? (
                    <>
                        {following.map((user, index) => (
                            <UserCard key={index} isFriend otherPerson={otherPerson} {...user} />
                        ))}
                    </>
                ) : (
                    <Text className="text-center">Follow more people to make more following.</Text>
                )}
            </View>
        </View>
    );
}
