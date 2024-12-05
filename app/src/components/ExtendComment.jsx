import { View, Text, TouchableOpacity } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import dbApi from '../apis/dbApi';
import Comment from './Comment';
import { Entypo } from '@expo/vector-icons';

function ExtendComment({ item, subCommentIds, commentVideoHandler, commentInputRef, commentInputValue, setVideos }) {
    const [showSubComments, setShowSubComments] = useState(false);
    const [subComments, setSubComments] = useState([]);

    // console.log(subComments);
    // TODO: xử lí xập ứng dụng, ứng dụng không phản hồi nếu thao tác nhiều
    const handleShowReplies = async (hideSubComment = true) => {
        try {
            const newComments = await Promise.all(
                subCommentIds
                    .filter((id) => !subComments.some((subComment) => subComment.commentId === id.commentId))
                    .map(async (id) => {
                        const comment = await dbApi.getAllInfoOfCommentById(id.commentId);
                        return comment;
                    }),
            );

            setSubComments((prev) => [...prev, ...newComments]);
        } catch (error) {
            console.log('handle show replies error: ', error);
        }
        console.log('fjsadijf');

        if (hideSubComment) setShowSubComments(!showSubComments);
    };

    useEffect(() => {
        if (subCommentIds.length < subComments.length) {
            setSubComments((prev) =>
                prev.filter((item) => subCommentIds.some((id) => id.commentId === item.commentId)),
            );
            return;
        }

        if (showSubComments && subCommentIds.length > subComments.length) {
            console.log('handle get replies');
            handleShowReplies(false);
        }
    }, [subCommentIds]);

    return (
        <View className="p-4 gap-2">
            <Comment
                comment={item}
                commentInputRef={commentInputRef}
                commentInputValue={commentInputValue}
                setVideos={setVideos}
            />

            {showSubComments && (
                <View className="pl-10 gap-5">
                    {subComments.map((subComment, index) => (
                        <Comment
                            key={index}
                            comment={subComment}
                            commentInputRef={commentInputRef}
                            commentInputValue={commentInputValue}
                            width={30}
                            height={30}
                            setVideos={setVideos}
                        />
                    ))}
                </View>
            )}

            {subCommentIds.length > 0 && (
                <View className="flex-row gap-2 pl-[45px] items-center">
                    <View className="w-[40px] h-1 border-b-[1px] border-[#818181]" />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        className="flex-row items-center"
                        onPress={() => {
                            handleShowReplies(true);
                        }}
                    >
                        <Text className="text-[#818181] text-sm">
                            {!showSubComments ? `Show ${subCommentIds.length} replies` : 'Hide replies'}{' '}
                        </Text>
                        <Entypo
                            name={!showSubComments ? 'chevron-small-down' : 'chevron-small-up'}
                            size={25}
                            color={'#818181'}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default ExtendComment;
