import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { storage } from '../../firebase.config';
import { useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function Home() {
    const [videoUrls, setVideoUrls] = useState([]);
    const videoRefs = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(null); 


    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                const listRef = storage.ref('videos');
                const result = await listRef.listAll();
                const urlPromises = result.items.map((itemRef) => itemRef.getDownloadURL());
                const urls = await Promise.all(urlPromises);
                setVideoUrls(urls);
            } catch (error) {
                alert.error("Lỗi khi lấy danh sách video:", error);
            }
        };

        fetchAllVideos();
    }, []);

    const onViewableItemsChanged = ({ viewableItems }) => {
        videoRefs.current.forEach(video => video?.pauseAsync());

     
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            videoRefs.current[index]?.playAsync();
            setCurrentIndex(index);
        }
    };

    const viewConfigRef = { viewAreaCoveragePercentThreshold: 80 };
    const onViewRef = useRef(onViewableItemsChanged);

    const handlePress = async (index) => {
        const video = videoRefs.current[index];
        if (video) {
            const status = await video.getStatusAsync();
            if (status.isPlaying) {
                video.pauseAsync();
            } else {
                video.playAsync();
            }
        }
    };

    
    useFocusEffect(
        React.useCallback(() => {
            if (currentIndex !== null) {
                videoRefs.current[currentIndex]?.playAsync();
            }

            return () => {
                videoRefs.current.forEach(video => video?.pauseAsync());
            };
        }, [currentIndex]) 
    );

    return (
        <FlatList
            data={videoUrls}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <TouchableWithoutFeedback onPress={() => handlePress(index)}>
                    <View style={styles.videoContainer}>
                        <Video
                            ref={(ref) => (videoRefs.current[index] = ref)}
                            style={styles.video}
                            source={{ uri: item }}
                            useNativeControls={false}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                        />
                    </View>
                </TouchableWithoutFeedback>
            )}
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={height}
            viewabilityConfig={viewConfigRef}
            onViewableItemsChanged={onViewRef.current}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    videoContainer: {
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
