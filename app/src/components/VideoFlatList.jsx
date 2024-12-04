import { View, FlatList, Dimensions } from 'react-native';
import React, { useCallback, useState } from 'react';
import Video from './Video';

const { height } = Dimensions.get('window');

export default function VideoFlatList({ videos = [], setVideos, setReload, isBottomTab = true, flatListRef }) {
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