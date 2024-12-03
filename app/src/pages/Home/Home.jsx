import { View, Text, StatusBar } from 'react-native';
import React, { Suspense, useEffect, useState } from 'react';
import dbApi from '../../apis/dbApi';
import VideoList from '../../components/VideoList';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [reload, setReload] = useState(false);
    const navigation = useNavigation();

    const fetchVideos = async () => {
        try {
            console.log('fetching...');
            const results = await dbApi.getAllVideos();

            console.log('complete');
            setVideos(results);
        } catch (error) {
            console.log('fetch video error: ', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [reload]);

    useEffect(() => {
        const unsubscribeBlur = navigation.addListener('blur', () => {
            setVideos((prev) => {
                return prev.map((video) => {
                    if (video.isPlayVideo === 'play') {
                        return { ...video, isPlayVideo: 'pause' };
                    } else {
                        return video;
                    }
                });
            });
        });

        const unsubscribeFocus = navigation.addListener('focus', () => {
            setVideos((prev) => {
                return prev.map((video) => {
                    if (video.isPlayVideo === 'pause') {
                        return { ...video, isPlayVideo: 'play' };
                    } else {
                        return video;
                    }
                });
            });
        });

        return () => {
            unsubscribeBlur();
            unsubscribeFocus();
        };
    }, []);

    // console.log(videos);

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
            {videos.length > 0 && <VideoList videos={videos} setVideos={setVideos} setReload={setReload} />}
        </View>
    );
}
