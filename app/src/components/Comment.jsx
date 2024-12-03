import { View, Text, Image, TouchableOpacity, Keyboard, Modal, Pressable, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { formatTimestamp, formatViews } from '../utils';
import { AntDesign } from '@expo/vector-icons';
import { UserContext } from '../context/UserProvider';
import SettingBox from '../pages/Setting/SettingBox';
import dbApi from '../apis/dbApi';
import classNames from 'classnames';
import useDebounce from '../hooks/useDebounce';
import { useNavigation } from '@react-navigation/native';

export default function Comment({ comment, commentInputRef, commentInputValue, width = 35, height = 35, setVideos }) {
    const { setReplyCommentId, user } = useContext(UserContext);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [likeComment, setLikeComment] = useState(false);
    const [isClickLikeBtn, setIsClickLikeBtn] = useState(false);
    const [isClickDislikeBtn, setIsClickDislikeBtn] = useState(false);
    const [dislikeComment, setDislikeComment] = useState(false);
    const [modifiedComment, setModifiedComment] = useState(comment);
    // const navigation = useNavigation();

    const handleReplyComment = () => {
        if (user) {
            setReplyCommentId(comment);
            commentInputRef.current?.clear();
            commentInputRef.current?.focus();
            commentInputRef.current?.setNativeProps({ placeholder: `Reply to ${comment.commentOwner.name}` });
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            console.log(commentInputValue);
            if (!commentInputValue) {
                setReplyCommentId(null);
                commentInputRef.current?.blur();
                commentInputRef.current?.setNativeProps({ placeholder: `Add comment...` });
            }
        });

        return () => {
            console.log('clean up');
            keyboardDidHideListener.remove();
        };
    }, [commentInputValue]);

    const handleDeleteComment = async () => {
        try {
            await dbApi.deleteCommentById(comment.commentId, comment.videoId, comment.parentCommentId);

            setVideos((prev) => {
                return prev.map((video) => {
                    if (video.videoId === comment.videoId) {
                        console.log('video.comments: ', video.comments);
                        console.log(
                            'new comments: ',
                            video.comments.filter((item) => item.commentId !== comment.commentId),
                        );
                        return {
                            ...video,
                            comments: video.comments.filter((item) => item.commentId !== comment.commentId),
                        };
                    } else return video;
                });
            });

            setShowOptionModal(false);
        } catch (error) {
            console.log('delete comment error: ', error);
        }
    };

    // handle like comment
    const likeDebounce = useDebounce(likeComment, 1000);

    useEffect(() => {
        if (isClickLikeBtn) {
            const handleLike = async () => {
                try {
                    console.log('like comment...');
                    await dbApi.updateCommentById(comment.commentId, {
                        likesCount: modifiedComment.likesCount,
                    });
                    console.log('complete like comment');
                } catch (error) {
                    console.log('like comment error: ', error);
                }
            };

            handleLike();
        }
    }, [likeDebounce]);

    const handleLikeComment = async () => {
        if (user) {
            setModifiedComment((prev) => ({
                ...prev,
                likesCount: !likeComment ? prev.likesCount + 1 : prev.likesCount - 1,
            }));
            setLikeComment(!likeComment);
            setIsClickLikeBtn(true);
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    // handle dislike comment
    const dislikeDebounce = useDebounce(dislikeComment, 1000);

    useEffect(() => {
        if (isClickDislikeBtn) {
            const handleDislike = async () => {
                try {
                    console.log('dislike comment...');
                    await dbApi.updateCommentById(comment.commentId, {
                        dislikesCount: modifiedComment.dislikesCount,
                    });
                    console.log('complete dislike comment');
                } catch (error) {
                    console.log('dislike comment error: ', error);
                }
            };

            handleDislike();
        }
    }, [dislikeDebounce]);

    return (
        <View>
            <TouchableOpacity
                className="flex-row gap-2 "
                activeOpacity={0.5}
                onLongPress={() => {
                    if (user && user.userId === comment.commentOwner.userId) {
                        setShowOptionModal(true);
                    } else {
                        Alert.alert('You are not the owner of this comment!');
                    }
                }}
                onPress={handleReplyComment}
            >
                <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
                    <Image
                        source={{ uri: comment.commentOwner.profilePicture }}
                        width={width}
                        height={height}
                        className="rounded-full"
                    />
                </TouchableOpacity>

                <View className="flex-1 gap-2">
                    <View>
                        <View className="flex-row gap-1 items-center">
                            <Text className="font-medium text-[#818181] border-2 border-transparent">
                                {comment.commentOwner.name}
                            </Text>
                            {comment.repliedCommentId &&
                                comment.parentCommentId !== comment.repliedCommentId.commentId && (
                                    <View className="flex-row items-center gap-2">
                                        <AntDesign name="caretright" size={10} color={'#818181'} />
                                        <Text className="font-medium text-[#818181]">
                                            {comment.repliedCommentId.name}
                                        </Text>
                                    </View>
                                )}
                        </View>
                        <Text>{comment.content}</Text>
                    </View>

                    <View className="flex-row ">
                        <View className="flex-row flex-1  gap-3 items-center">
                            <Text className="text-sm text-[#818181]">{formatTimestamp(comment.createdAt)}</Text>
                            <TouchableOpacity activeOpacity={0.5} onPress={handleReplyComment}>
                                <Text className="text-blue-500 font-mediumtext-sm">Reply</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row  items-center gap-4">
                            <View className="flex-row gap-1">
                                <AntDesign
                                    name={likeComment ? 'heart' : 'hearto'}
                                    size={20}
                                    color={likeComment ? '#f7195f' : 'black'}
                                    onPress={handleLikeComment}
                                />
                                <Text
                                    className={classNames({
                                        'text-[#f7195f]': likeComment,
                                    })}
                                >
                                    {formatViews(modifiedComment.likesCount)}
                                </Text>
                            </View>
                            <AntDesign
                                name={dislikeComment ? 'dislike1' : 'dislike2'}
                                size={20}
                                onPress={() => {
                                    if (user) {
                                        setModifiedComment((prev) => ({
                                            ...prev,
                                            dislikesCount: !dislikeComment
                                                ? prev.dislikesCount + 1
                                                : prev.dislikesCount - 1,
                                        }));
                                        setDislikeComment(!dislikeComment);
                                        setIsClickDislikeBtn(true);
                                    } else {
                                        Alert.alert('Please log into an existing account!');
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal visible={showOptionModal} transparent={true}>
                <Pressable className="flex-1 bg-[#00000080] justify-end" onPress={() => setShowOptionModal(false)}>
                    <View className="bg-[#f0f0f0] pb-5 px-2 rounded-s-xl">
                        <SettingBox
                            data={[
                                {
                                    iconName: 'delete-outline',
                                    title: 'Delete',
                                    showArrow: false,
                                    onPress: function () {
                                        handleDeleteComment();
                                    },
                                },
                            ]}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
