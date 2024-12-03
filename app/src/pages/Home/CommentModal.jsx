import { View, Text, Image, Alert } from 'react-native';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetFooter,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from '@gorhom/bottom-sheet';

import { formatViews } from '../../utils';
import CustomButton from '../../components/Button';

export default function CommentModal({ bottomSheetModalRef }) {
    return (
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
                } else {
                    setEnableFlatList(true);
                }
            }}
            keyboardBehavior="fillParent"
            android_keyboardInputMode="adjustResize"
        >
            <BottomSheetView className="p-3 gap-2 " style={{ borderBottomWidth: 1, borderBottomColor: '#f1f1f1' }}>
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
                        <Image source={{ uri: user.profilePicture }} width={45} height={45} className="rounded-full " />
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
                            onSubmitEditing={() => commentVideoHandler()}
                        />
                    </View>
                </View>
                {commentInputValue.length > 0 && (
                    <View className="items-end">
                        <CustomButton
                            Icon={<AntDesign name="arrowup" size={20} color={'white'} />}
                            type={'primary'}
                            className={'!rounded-full'}
                            onPress={() => commentVideoHandler()}
                        />
                    </View>
                )}
            </BottomSheetView>

            <BottomSheetFlatList
                data={video.comments}
                renderItem={({ item, index }) => <Text key={index}>{item.videoId}</Text>}
                enableDynamicSizing={false}
                showsVerticalScrollIndicator={false}
            />
        </BottomSheetModal>
    );
}
