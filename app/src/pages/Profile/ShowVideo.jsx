import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoList from '../../components/VideoList';
import dbApi from '../../apis/dbApi';
import { AntDesign } from '@expo/vector-icons';

export default function ShowVideo() {
    const route = useRoute();
    const [videos, setVideos] = useState();
    const [initVideoId, setInitVideoId] = useState();
    const navigation = useNavigation();
    const flatListRef = useRef();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await Promise.all(
                    route.params?.videos.map(async (video) => {
                        const videoOwner = await dbApi.getUserData(video.userId);
                        return { ...video, videoOwner };
                    }),
                );

                setVideos(data);
                setInitVideoId(route.params?.initVideoId);
            } catch (error) {
                console.log('fetch video error: ', error);
            }
        };

        fetchVideos();
        // console.log(route.params?.videos);
        // console.log(route.params?.initVideoId);
    }, []);

    useEffect(() => {
        if (initVideoId) {
            const index = videos.findIndex((video) => video.videoId === initVideoId);
            if (index !== -1) {
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: false,
                });
            }
        }
    }, [initVideoId]);

    return (
        <View className="flex-1 bg-black ">
            <View className="absolute top-0 py-3 px-5 z-50">
                <AntDesign name="arrowleft" size={24} color={'#fff'} onPress={() => navigation.goBack()} />
            </View>
            <VideoList
                videos={videos}
                setVideos={setVideos}
                initVideoIdId={initVideoId}
                isBottomTab={false}
                flatListRef={flatListRef}
            />
        </View>
    );
}
