import React, { memo, useEffect, useState } from 'react';
import { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import dbApi from '../apis/dbApi';
import ExtendComment from './ExtendComment';
import { Text } from 'react-native';

function CommentList({ commentIds, commentVideoHandler, commentInputRef, commentInputValue, setVideos }) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                console.log('getting comments...');
                setIsLoading(true);

                const data = await Promise.all(
                    commentIds.map(async (id) => {
                        if (!id.parentCommentId) {
                            const comment = await dbApi.getAllInfoOfCommentById(id.commentId);

                            return comment;
                        } else {
                            return id;
                        }
                    }),
                );

                console.log('complete getting comments');

                setComments(data);
                setIsLoading(false);
            } catch (error) {
                console.log('fetch comment error: ', error);
            }
        };

        fetchComment();
    }, [commentIds]);

    // console.log('commentIds: ', commentIds);
    // console.log('comments: ', comments);

    return (
        // <BottomSheetFlatList
        //     data={comments}
        //     renderItem={({ item, index }) => {
        //         if (!item.parentCommentId) {
        //             const subComments = comments.filter((comment) => comment.parentCommentId === item.commentId);
        //             console.log('uuuuuuuwu');
        //             return (
        //                 <ExtendComment
        //                     item={item}
        //                     subCommentIds={subComments}
        //                     commentVideoHandler={commentVideoHandler}
        //                     commentInputRef={commentInputRef}
        //                     commentInputValue={commentInputValue}
        //                     key={index}
        //                     setVideos={setVideos}
        //                 />
        //             );
        //         }
        //     }}
        //     enableDynamicSizing={false}
        //     showsVerticalScrollIndicator={false}
        // />
        <>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <BottomSheetScrollView>
                    {comments
                        .filter((item) => !item.parentCommentId)
                        .map((item, index) => {
                            const subComments = comments.filter(
                                (comment) => comment.parentCommentId === item.commentId,
                            );

                            return (
                                <ExtendComment
                                    item={item}
                                    subCommentIds={subComments}
                                    commentVideoHandler={commentVideoHandler}
                                    commentInputRef={commentInputRef}
                                    commentInputValue={commentInputValue}
                                    key={index}
                                    setVideos={setVideos}
                                />
                            );
                        })}
                </BottomSheetScrollView>
            )}
        </>
    );
}

export default memo(CommentList);
