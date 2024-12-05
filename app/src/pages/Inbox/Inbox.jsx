import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Search from '../../components/Search';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { db } from '../../../firebase.config';
import InboxTag from './InboxTag';
import useDebounce from '../../hooks/useDebounce';

const { height } = Dimensions.get('window');

export default function Inbox() {
    // const [searchValue, setSearchValue] = useState('');
    // const [searchResult, setSearchResult] = useState([]);
    const [friends, setFriends] = useState([]);
    const [currentChatRooms, setCurrentChatRooms] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { user, isAuth } = useContext(UserContext);

    useEffect(() => {
        const fetchApi = async () => {
            const users = await Promise.all(
                currentChatRooms.map((chatroom) => {
                    const participantIds = chatroom.participants.filter((uid) => uid !== user.userId);

                    return dbApi.getUserData(participantIds[0]);
                }),
            );

            setRefreshing(false);
            setFriends(users);
        };

        if (currentChatRooms.length > 0 && isAuth) fetchApi();
    }, [user, currentChatRooms, refreshing]);

    // Fetch room info

    const onRefresh = () => {
        setRefreshing(true);
    };

    useEffect(() => {
        if (user) {
            const unsubscribe = db
                .collection('rooms')
                .where('participants', 'array-contains', user.userId)
                .onSnapshot((querySnapshot) => {
                    if (querySnapshot.empty) return;

                    const chatRooms = [];
                    querySnapshot.forEach((doc) => {
                        chatRooms.push(doc.data());
                    });
                    setCurrentChatRooms(chatRooms);
                });

            return () => {
                unsubscribe();
            };
        }
    }, [user]);
    // console.log(user.userId);
    return (
        <>
            {user ? (
                <View className="px-5 gap-3">
                    <View className="py-3">
                        <Text className="text-center text-xl font-semibold">Inbox</Text>
                    </View>

                    {/* <Search searchValue={searchValue} setSearchValue={setSearchValue} placeholder={'Search'} /> */}

                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <View className="gap-3">
                            {currentChatRooms.map((chatroom, index) => {
                                const participantIds = chatroom.participants.filter((uid) => uid !== user.userId);

                                const friend = friends.find((info) => info?.userId === participantIds[0]);

                                return <InboxTag key={index} lastMessage={chatroom.lastMessage} {...friend} />;
                            })}
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View
                    style={{
                        height: height,
                    }}
                    className="items-center justify-center"
                >
                    <View className="w-[300px] items-center">
                        <Text>Vui lòng đăng nhập</Text>
                    </View>
                </View>
            )}
        </>
    );
}
