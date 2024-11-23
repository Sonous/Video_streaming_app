import { View, Text, ScrollView, KeyboardAvoidingView, Image, Keyboard } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { formatTimestamp, getRoomId } from '../../utils';
import { db } from '../../../firebase.config';
import ChatRoomHeader from './ChatRoomHeader';
import ChatInput from './ChatInput';
import Message from './Message';

export default function ChatRoom({ route }) {
    const { friendId } = route.params;
    const {
        user: { userId },
    } = useContext(UserContext);
    const [friendInfo, setFriendInfo] = useState({});
    const [messages, setMessages] = useState([]);

    const scrollRef = useRef(null);

    const roomId = getRoomId(friendId, userId);

    useEffect(() => {
        const fetchApi = async () => {
            await dbApi.makeChatRoom(roomId, userId, friendId);
            const info = await dbApi.getUserData(friendId);

            setFriendInfo(info);
        };

        fetchApi();

        const unsubscribe = db
            .collection('messages')
            .where('roomId', '==', roomId)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const arrMessages = [];
                    querySnapshot.forEach((doc) => {
                        arrMessages.push({
                            messageId: doc.id,
                            ...doc.data(),
                        });
                    });
                    arrMessages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
                    setMessages(arrMessages);
                } else {
                    setMessages([]);
                }
            });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const updateChatRoom = async () => {
            if (messages.length === 0) {
                await dbApi.updateChatRoom(roomId, {
                    lastMessage: null,
                });
                return;
            }

            const lastMessage = messages.reduce((latest, current) => {
                return current.createdAt > latest.createdAt ? current : latest;
            });

            await dbApi.updateChatRoom(roomId, {
                lastMessage: lastMessage,
            });

            scrollToBottom();
        };

        updateChatRoom();
    }, [messages]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const scrollToBottom = () => {
        console.log('jfidji');
        scrollRef.current?.scrollToEnd({ animated: false });
    };

    // console.log(messages.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    // console.log(messages[0].createdAt);

    // handle function
    const handleDeleteMessage = async (messageId) => {
        await dbApi.deleteMessage(messageId, roomId);
        setIsShowOptions(false);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View className={`flex-1 gap-2`}>
                <ChatRoomHeader {...friendInfo} />
                <ScrollView ref={scrollRef} onContentSizeChange={scrollToBottom}>
                    <View className="items-center p-5">
                        <Image
                            source={{ uri: friendInfo?.profilePicture }}
                            className="h-[80px] w-[80px] rounded-full"
                        />
                        <Text className="text-center mt-3 mb-2 font-semibold text-xl">{friendInfo?.name}</Text>
                        <Text className="text-center">@{friendInfo?.username}</Text>
                        <Text className="text-center">
                            {friendInfo?.following?.length} following - {friendInfo?.followers?.length} follower
                        </Text>
                    </View>
                    <View className="p-3 gap-2">
                        {messages.map((message, index) => {
                            const distance = messages[index + 1]?.createdAt.toDate() - message?.createdAt.toDate();

                            return (
                                <View key={index}>
                                    {index === 0 && (
                                        <Text className="text-center p-5">{formatTimestamp(message?.createdAt)}</Text>
                                    )}
                                    <Message
                                        friendId={friendId}
                                        avatar={friendInfo?.profilePicture}
                                        nextMessageSenderId={messages[index + 1]?.senderId}
                                        nextCreatedAtMessage={messages[index + 1]?.createdAt}
                                        roomId={roomId}
                                        handleDeleteMessage={() => handleDeleteMessage(message.messageId)}
                                        {...message}
                                    />
                                    {distance >= 300000 && (
                                        <Text className="text-center p-5">
                                            {formatTimestamp(messages[index + 1]?.createdAt)}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
                <ChatInput roomId={roomId} friendId={friendId} />
            </View>
        </KeyboardAvoidingView>
    );
}
