import { View, Text, Dimensions, Pressable, TouchableOpacity, Image, Alert } from 'react-native';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';

import { formatViews } from '../utils';
import dbApi from '../apis/dbApi';
import { UserContext } from '../context/UserProvider';
import useDebounce from '../hooks/useDebounce';
import CustomButton from './Button';
import CommentList from './CommentList';

const { height, width } = Dimensions.get('window');

function Video({ video, setVideos, setReload, setEnableFlatList, setCommentModalVisible, isBottomTab }) {
    const [endSlice, setEndSlice] = useState(40);
    const { user, replyCommentId, setReplyCommentId } = useContext(UserContext);
    const [isLike, setIsLike] = useState(video.likes.includes(user?.userId));
    const [isMark, setIsMark] = useState(video.marks.includes(user?.userId));
    const [isClickLikeBtn, setIsClickLikeBtn] = useState(false);
    const [isClickMarkBtn, setIsClickMarkBtn] = useState(false);
    const [commentModalState, setCommentModalState] = useState(-1);
    const [commentInputValue, setCommentInputValue] = useState('');
    const [duration, setDuration] = useState(0);
    const navigation = useNavigation();

    // Config video
    const bottomTabHeight = isBottomTab ? useBottomTabBarHeight() : 0;

    const player = useVideoPlayer(video.videoUrl, (player) => {
        player.loop = true;
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    useEffect(() => {
        switch (video.isPlayVideo) {
            case 'play':
                player.play();
                break;
            case 'stop':
                player.pause();
                player.currentTime = 0;
                break;
            case 'pause':
                player.pause();
                break;
            default:
                break;
        }
    }, [video]);

    // handle like video
    const likeDebounce = useDebounce(isLike, 1000);

    useEffect(() => {
        if (isClickLikeBtn) {
            const updateLike = async () => {
                try {
                    await dbApi.addLikeToVideo(video.videoId, user.userId);
                } catch (error) {
                    console.error('update like video error: ', error);
                }
            };

            updateLike();
            return;
        }
    }, [likeDebounce]);

    const likeVideoHandler = async () => {
        if (user) {
            setVideos((prev) => {
                return prev.map((item) => {
                    if (item.videoId === video.videoId) {
                        if (item.likes.includes(user.userId)) {
                            return {
                                ...item,
                                likes: item.likes.filter((id) => id !== user.userId),
                            };
                        } else {
                            return {
                                ...item,
                                likes: [...item.likes, user.userId],
                            };
                        }
                    } else return item;
                });
            });
            setIsLike(!isLike);
            setIsClickLikeBtn(true);
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    // handle comments
    const bottomSheetModalRef = useRef(null);
    const commentInputRef = useRef(null);

    const openComments = () => {
        bottomSheetModalRef.current?.present();
    };

    const commentVideoHandler = async (parentCommentId = null, parentSubCommentIds = [], repliedCommentId = null) => {
        try {
            console.log('comment video...');

            // console.log(repliedCommentId);
            // console.log(replyCommentId.commentOwner.name);
            const commentId = await dbApi.addCommentToVideo(
                video.comments,
                video.videoId,
                user.userId,
                commentInputValue,
                parentCommentId,
                repliedCommentId,
            );

            if (repliedCommentId) {
                await dbApi.updateCommentById(repliedCommentId.commentId, {
                    subCommentIds: [...parentSubCommentIds, commentId],
                });
            }

            // console.log('commentId: ', commentId);
            commentInputRef.current?.clear();
            commentInputRef.current?.blur();
            setReplyCommentId(null);
            setCommentInputValue('');

            // update comments of video
            setVideos((prev) => {
                return prev.map((item) => {
                    if (item.videoId === video.videoId) {
                        return {
                            ...item,
                            comments: [
                                ...item.comments,
                                {
                                    commentId,
                                    parentCommentId,
                                },
                            ],
                        };
                    } else return item;
                });
            });
        } catch (error) {
            console.error('comment video error: ', error);
        }
    };

    // console.log(replyCommentId);

    const handleAddComment = async () => {
        if (replyCommentId) {
            // const replyCommentId = await dbApi.getOnlyCommentById(replyCommentId);
            if (!replyCommentId.parentCommentId) {
                await commentVideoHandler(replyCommentId.commentId, replyCommentId.subCommentIds, {
                    commentId: replyCommentId.commentId,
                    userId: replyCommentId.userId,
                    name: replyCommentId.commentOwner.name,
                });
            } else {
                await commentVideoHandler(replyCommentId.parentCommentId, replyCommentId.subCommentIds, {
                    commentId: replyCommentId.commentId,
                    userId: replyCommentId.userId,
                    name: replyCommentId.commentOwner.name,
                });
            }

            // console.log(replyCommentId);
        } else {
            commentVideoHandler();
        }
    };

    // handle mark video
    const markDebounce = useDebounce(isMark, 1000);

    useEffect(() => {
        if (isClickMarkBtn) {
            const updateMark = async () => {
                try {
                    await dbApi.addMarkToVideo(video.videoId, user.userId);
                } catch (error) {
                    console.error('update like video error: ', error);
                }
            };

            updateMark();
            return;
        }
    }, [markDebounce]);

    const markVideoHandler = async () => {
        if (user) {
            setVideos((prev) => {
                return prev.map((item) => {
                    if (item.videoId === video.videoId) {
                        if (item.marks.includes(user.userId)) {
                            return {
                                ...item,
                                marks: item.marks.filter((id) => id !== user.userId),
                            };
                        } else {
                            return {
                                ...item,
                                marks: [...item.marks, user.userId],
                            };
                        }
                    } else return item;
                });
            });

            setIsMark(!isMark);
            setIsClickMarkBtn(true);
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    // handle share video
    const shareVideoHandler = async () => {};

    // handle nav to profile
    const handleNavToProfile = () => {
        navigation.navigate('OtherProfile', {
            personId: video.userId,
        });
    };

    // handle update view

    useEffect(() => {
        if (player.duration > 0) {
            setDuration(player.duration);
        }
    }, [player.duration]);

    // TODO: apply another rule to update view for video
    useEffect(() => {
        const updateView = async () => {
            try {
                console.log('update view...');
                await dbApi.updateVideo(video.videoId, { viewersCount: video.viewersCount + 1 });
                console.log('complete');
            } catch (error) {
                console.log('update view error: ', error);
            }
        };

        if (video.isPlayVideo === 'play' && duration > 0) {
            const unsubscribe = setTimeout(updateView, Math.floor(duration * 0.5 * 1000));

            return () => {
                clearTimeout(unsubscribe);
            };
        }
    }, [duration]);

    return (
        <View className="">
            <VideoView
                player={player}
                style={{ width: width, height: height - bottomTabHeight }}
                nativeControls={false}
            />

            <Pressable
                className="bg-transparent absolute z-0 top-0 right-0 p-5 w-full h-full items-center justify-center"
                onPress={() => {
                    if (commentModalState !== -1) {
                        bottomSheetModalRef.current?.dismiss();
                    } else {
                        if (isPlaying) {
                            player.pause();
                            setVideos((prev) =>
                                prev.map((item) => {
                                    if (item.videoId === video.videoId) {
                                        return {
                                            ...item,
                                            isPlayVideo: 'pause',
                                        };
                                    } else return item;
                                }),
                            );
                        } else {
                            player.play();
                            setVideos((prev) =>
                                prev.map((item) => {
                                    if (item.videoId === video.videoId) {
                                        return {
                                            ...item,
                                            isPlayVideo: 'play',
                                        };
                                    } else return item;
                                }),
                            );
                        }
                    }
                }}
            >
                {!isPlaying && <AntDesign name="playcircleo" size={50} className="text-center" />}
            </Pressable>

            <View className=" absolute bottom-0 left-0 p-5 max-w-[350px]">
                <Text className="text-white font-medium text-lg" onPress={handleNavToProfile}>
                    {video.videoOwner.name}
                </Text>

                <View>
                    <Text className="text-white">
                        {video.description.slice(0, endSlice)}
                        {endSlice === 40 && video.description.length > 40 && (
                            <Text className="font-medium" onPress={() => setEndSlice(video.description.length)}>
                                ...more
                            </Text>
                        )}
                    </Text>
                    {endSlice !== 40 && (
                        <View className="items-end">
                            <Text className="font-medium text-white" onPress={() => setEndSlice(40)}>
                                less
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View className=" absolute bottom-10 right-3 max-w-[350px] items-center gap-5">
                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleNavToProfile}>
                        <Image
                            source={{ uri: video.videoOwner.profilePicture }}
                            width={45}
                            height={45}
                            className="rounded-full border-[1px] border-white"
                        />
                    </TouchableOpacity>
                </View>

                <View className="gap-2">
                    {/* Like */}
                    <Pressable className="items-center" onPress={likeVideoHandler}>
                        <AntDesign name="heart" size={30} color={isLike ? '#f7195f' : 'white'} />
                        <Text className="text-white">{formatViews(video.likes.length)}</Text>
                    </Pressable>

                    {/* Comment */}
                    <Pressable className="items-center" onPress={openComments}>
                        <MaterialCommunityIcons name="message-text" size={30} color={'white'} />
                        <Text className="text-white">{formatViews(video.comments.length)}</Text>
                    </Pressable>

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={['65%']}
                        enablePanDownToClose={true}
                        enableDynamicSizing={false}
                        enableOverDrag={false}
                        onChange={(index) => {
                            setCommentModalState(index);
                            if (index !== -1) {
                                setEnableFlatList(false);
                                setCommentModalVisible(true);
                            } else {
                                setEnableFlatList(true);
                                setCommentModalVisible(false);
                                setReplyCommentId(null);
                            }
                        }}
                        keyboardBehavior="fillParent"
                        android_keyboardInputMode="adjustResize"
                    >
                        <BottomSheetView
                            className="p-3 gap-2 "
                            style={{ borderBottomWidth: 1, borderBottomColor: '#f1f1f1' }}
                        >
                            <View className="flex-row items-center ">
                                <View className="w-full">
                                    <Text className="text-lg font-medium text-center ">{`${formatViews(
                                        video.comments.length,
                                    )} comments`}</Text>
                                </View>
                                <AntDesign
                                    name="close"
                                    size={20}
                                    color={'black'}
                                    onPress={() => bottomSheetModalRef.current?.dismiss()}
                                    className="absolute top-[50%] -translate-y-1/2 right-0 "
                                />
                            </View>
                            <View className="flex-row gap-3">
                                {user && (
                                    <Image
                                        source={{ uri: user.profilePicture }}
                                        width={45}
                                        height={45}
                                        className="rounded-full "
                                    />
                                )}

                                <View
                                    className="flex-1 "
                                    onTouchStart={() => {
                                        if (!user) {
                                            Alert.alert('Please login to comment');
                                        }
                                    }}
                                >
                                    <BottomSheetTextInput
                                        ref={commentInputRef}
                                        onChangeText={(value) => {
                                            setCommentInputValue(value.trim());
                                        }}
                                        className="p-4 bg-[#f6f6f6] rounded-2xl align-top "
                                        placeholder="Add comment..."
                                        multiline
                                        maxLength={200}
                                        editable={!!user}
                                        onSubmitEditing={handleAddComment}
                                    />
                                </View>
                            </View>
                            {commentInputValue.length > 0 && (
                                <View className="items-end">
                                    <CustomButton
                                        Icon={<AntDesign name="arrowup" size={20} color={'white'} />}
                                        type={'primary'}
                                        className={'!rounded-full'}
                                        onPress={handleAddComment}
                                    />
                                </View>
                            )}
                        </BottomSheetView>

                        <CommentList
                            commentIds={video.comments}
                            commentVideoHandler={commentVideoHandler}
                            commentInputRef={commentInputRef}
                            commentInputValue={commentInputValue}
                            setVideos={setVideos}
                        />
                    </BottomSheetModal>

                    {/* Save Video */}
                    <Pressable className="items-center" onPress={markVideoHandler}>
                        <MaterialCommunityIcons name="bookmark" size={30} color={isMark ? '#ffe100' : 'white'} />
                        <Text className="text-white">{formatViews(video.marks.length)}</Text>
                    </Pressable>

                    {/* Share */}
                    <Pressable className="items-center" onPress={shareVideoHandler}>
                        <MaterialCommunityIcons name="share" size={30} color={'white'} />
                        <Text className="text-white">{formatViews(0)}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default memo(Video);
