import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { formatTimestamp, truncateText } from '../../utils';
import classNames from 'classnames';

export default function InboxTag({ lastMessage, userId, name, profilePicture, isActive }) {
    const navigation = useNavigation();

    const handleOpenChatRoom = () => {
        navigation.navigate('ChatRoom', {
            friendId: userId,
        });
    };
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={handleOpenChatRoom} className="flex-row items-center gap-3 ">
            <View>
                <Image source={{ uri: profilePicture }} className="w-[60px] h-[60px] rounded-full" />
                <View
                    className={classNames('absolute bottom-0 right-0 w-[13px] h-[13px] rounded-full', {
                        'bg-[#595959]': !isActive,
                        'bg-[#1cf232]': isActive,
                    })}
                />
            </View>

            <View>
                <Text className="text-lg font-medium">{name}</Text>
                {lastMessage && (
                    <Text className="text-[#898989]">
                        {lastMessage.type === 'text'
                            ? truncateText(lastMessage.content, 35)
                            : lastMessage.type === 'image'
                            ? 'Đã gửi một ảnh'
                            : 'Đã gửi một video'}{' '}
                        • {formatTimestamp(lastMessage.createdAt)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
