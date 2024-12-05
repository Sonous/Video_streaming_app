import { View, Text, StatusBar } from 'react-native';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import dbApi from '../../apis/dbApi';
import VideoFlatList from '../../components/VideoFlatList';
import Video from '../../components/Video';
import { useIsFocused, useNavigation, useNavigationState } from '@react-navigation/native';
import { UserContext } from '../../context/UserProvider';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [reload, setReload] = useState(false);
    const [isEnabledHome, setIsEnabledHome] = useState(false);
    const { setLoading } = useContext(UserContext);
    const navigation = useNavigation();

    const fetchVideos = async () => {
        try {
            console.log('fetching...');
            setLoading(true);

            const results = await dbApi.getAllVideos();

            console.log('complete');
            setVideos(results);
            setLoading(false);
            setReload(false);
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
            setIsEnabledHome(false);
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
            setIsEnabledHome(true);
        });

        return () => {
            unsubscribeBlur();
            unsubscribeFocus();
        };
    }, []);

    // console.log(isEnabledHome);
    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
            {videos.length > 0 && (
                <VideoFlatList
                    videos={videos}
                    setVideos={setVideos}
                    reload={reload}
                    setReload={setReload}
                    isEnabledHome={isEnabledHome}
                />
            )}
        </View>
    );
}
