import { View, Text, FlatList, Dimensions, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Video from './Video';
import { useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet';

const { height } = Dimensions.get('window');

export default function VideoList({
    videos = [],
    setVideos,
    setReload,
    initVideoId = null,
    isBottomTab = true,
    flatListRef,
}) {
    const [isEnableFlatList, setEnableFlatList] = useState(true);
    const [isCommentModalVisible, setCommentModalVisible] = useState(false);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 70,
    };

    const viewabilityConfigCallback = useCallback(
        ({ viewableItems }) => {
            if (viewableItems.length > 0 && !isCommentModalVisible) {
                setVideos((prev) =>
                    prev.map((video) => {
                        if (video.videoId !== viewableItems[0].item.videoId) {
                            return {
                                ...video,
                                isPlayVideo: 'stop',
                            };
                        } else {
                            return {
                                ...video,
                                isPlayVideo: 'play',
                            };
                        }
                    }),
                );
            }
        },
        [isCommentModalVisible],
    );

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={videos}
                renderItem={({ item }) => (
                    <Video
                        video={item}
                        setVideos={setVideos}
                        setEnableFlatList={setEnableFlatList}
                        setCommentModalVisible={setCommentModalVisible}
                        isBottomTab={isBottomTab}
                    />
                )}
                getItemLayout={(data, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
                keyExtractor={(item) => item.videoId}
                pagingEnabled
                decelerationRate="fast"
                snapToAlignment="start"
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={viewabilityConfigCallback}
                viewabilityConfig={viewabilityConfig}
                scrollEnabled={isEnableFlatList}
            />
        </View>
    );
}
