import { View, Text, Image, Pressable } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';

// border-[1px] border-black

export default function Message({
    messageId,
    senderId,
    content,
    createdAt,
    friendId,
    type,
    attachmentUrl = '',
    nextMessageSenderId = '',
    nextCreatedAtMessage,
    avatar,
    roomId,
    handleDeleteMessage,
}) {
    const { user } = useContext(UserContext);
    const distance = nextCreatedAtMessage?.toDate() - createdAt.toDate();
    const [isShowOptions, setIsShowOptions] = useState(false);

    // Play video
    const videoRef = useRef();
    const player = useVideoPlayer(attachmentUrl, (player) => {
        player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    return (
        <View
            className={classNames('flex-row items-end gap-2', {
                'justify-end': senderId === user.userId,
            })}
        >
            {senderId === friendId && (nextMessageSenderId !== friendId || distance >= 300000) ? (
                <Image source={{ uri: avatar }} className="w-[30px] h-[30px] rounded-full" />
            ) : (
                <View className="w-[30px] h-[30px]"></View>
            )}

            {isShowOptions && user.userId === senderId && (
                <View>
                    <AntDesign name="delete" size={25} onPress={handleDeleteMessage} />
                </View>
            )}

            <Pressable onPress={() => setIsShowOptions(false)} onLongPress={() => setIsShowOptions(true)}>
                {type === 'text' ? (
                    <View
                        className={classNames('p-3 rounded-2xl max-w-[250px]', {
                            'bg-[#59b5d6]': senderId === user.userId,
                            'bg-white': senderId === friendId,
                        })}
                    >
                        <Text
                            className={classNames('font-medium tracking-wider', {
                                'text-white': senderId === user.userId,
                            })}
                        >
                            {content}
                        </Text>
                    </View>
                ) : type === 'image' ? (
                    <Image
                        source={{ uri: attachmentUrl }}
                        className="h-[200px] w-[150px] rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <VideoView
                        ref={videoRef}
                        player={player}
                        style={{
                            width: 300,
                            height: 350,
                        }}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                )}
            </Pressable>

            {isShowOptions && user.userId !== senderId && (
                <View>
                    <AntDesign name="delete" size={25} onPress={handleDeleteMessage} />
                </View>
            )}
        </View>
    );
}
