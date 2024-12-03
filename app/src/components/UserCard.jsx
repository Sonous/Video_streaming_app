import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Button from './Button';
import { formatViews, getRoomId } from '../utils';
import classNames from 'classnames';
import dbApi from '../apis/dbApi';
import { UserContext } from '../context/UserProvider';
import { useNavigation } from '@react-navigation/native';

// border-[1px] border-black

export default function UserCard({
    suggestedAccount = false,
    isFriend = false,
    userId,
    profilePicture,
    name,
    username,
    followers,
    noFriendfollowers = [],
    otherPerson,
}) {
    const { user } = useContext(UserContext);
    const [btnStatus, setBtnStatus] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            const isStayInFollowers = user.followers.includes(userId);
            const isStayInFollowing = user.following.includes(userId);

            if (isStayInFollowers && isStayInFollowing) {
                setBtnStatus('Message');
            } else if (isStayInFollowers) {
                setBtnStatus('Follow back');
            } else if (isStayInFollowing) {
                setBtnStatus('Following');
            } else {
                setBtnStatus('Follow');
            }
        }
    }, [btnStatus, user]);

    const handleFollow = async () => {
        await dbApi.updateUserInfo(userId, {
            followers: [...followers, user.userId],
        });
        await dbApi.updateUserInfo(user.userId, {
            following: [...user.following, userId],
        });
    };

    const handleRemoveFollow = async () => {
        await dbApi.updateUserInfo(userId, {
            followers: followers.filter((follower) => follower !== user.userId),
        });
        await dbApi.updateUserInfo(user.userId, {
            following: user.following.filter((following) => following !== userId),
        });
    };

    const handleOpenMessage = () => {
        navigation.navigate('ChatRoom', {
            friendId: userId,
        });
    };

    const handleNavToProfile = () => {
        navigation.navigate('OtherProfile', {
            personId: userId,
        });
    };

    console.log(user.userId !== userId);

    return (
        <TouchableOpacity
            className="flex-row gap-3 items-center "
            // style={{ width: Dimensions.get('window').width }}
            activeOpacity={0.5}
            onPress={handleNavToProfile}
        >
            <Image source={{ uri: profilePicture }} className="w-[70px] h-[70px] rounded-full" />

            <View className="gap-3 w-[290px] flex-row  flex-1">
                <View className="flex-1">
                    <Text className="text-lg font-medium">{name}</Text>
                    <Text className="text-neutral-500">{suggestedAccount ? 'Follows you' : username}</Text>
                    {!suggestedAccount && (
                        <Text className="text-neutral-500">{formatViews(followers.length)} followers</Text>
                    )}
                </View>
            </View>

            {user.userId !== userId && (
                <View className="items-center justify-center">
                    <Button
                        title={btnStatus}
                        type={['Follow', 'Follow back'].includes(btnStatus) ? 'primary' : 'gray'}
                        onPress={() => {
                            if (['Follow', 'Follow back'].includes(btnStatus)) {
                                handleFollow();
                            } else if (btnStatus === 'Following') {
                                handleRemoveFollow();
                            } else {
                                handleOpenMessage();
                            }
                        }}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}
