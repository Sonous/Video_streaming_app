import { View, Text, Image, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import classNames from 'classnames';

import QuantityBox from '../../components/QuantityBox';
import ProfileLayout from '../../layouts/ProfileLayout';
import Button from '../../components/Button';
import ProfileVideo from './ProfileVideo';
import { formatViews } from '../../utils';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { db } from '../../../firebase.config';

const { height } = Dimensions.get('window');

const subPage = {
    post: 'post',
    mark: 'mark',
};

export default function Profile({ navigation }) {
    const [currentSubPage, setCurrentSubPage] = useState('post');
    const [postedVideos, setPostedVideos] = useState([]);
    const [markedVideos, setMarkedVideos] = useState([]);
    const { isAuth, user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            const unsubscribePostedVideo = db
                .collection('videos')
                .where('userId', '==', user.userId)
                .onSnapshot((querySnapshot) => {
                    const videos = [];
                    querySnapshot.forEach((doc) => {
                        videos.push(doc.data());
                    });
                    setPostedVideos(videos);
                });

            const unsubscribeMarkedVideo = db
                .collection('bookmarks')
                .where('userId', '==', user.userId)
                .onSnapshot((querySnapshot) => {
                    const videosPendingPromise = [];

                    querySnapshot.forEach((markedVideo) => {
                        db.collection('videos')
                            .doc(markedVideo.data().videoId)
                            .get()
                            .then((video) => {
                                videosPendingPromise.push(video.data());
                            });
                    });

                    setMarkedVideos(videosPendingPromise);
                });

            return () => {
                unsubscribePostedVideo();
                unsubscribeMarkedVideo();
            };
        }
    }, [user]);

    const handleSwitchSubPage = (subPage) => {
        setCurrentSubPage(subPage);
    };

    const handleNav = (dest) => {
        navigation.navigate(dest);
    };

    return (
        <>
            {isAuth && user ? (
                <ProfileLayout type="personal" navigation={navigation}>
                    <View className="p-2">
                        <View className="items-center gap-3">
                            <View className="items-center">
                                <Image
                                    source={
                                        user.profilePicture
                                            ? { uri: user.profilePicture }
                                            : require('../../assets/images/avatar_placeholder.png')
                                    }
                                    className="w-24 h-24 rounded-full"
                                />
                                <Text className="text-lg font-semibold text-center">{user.username}</Text>
                            </View>
                            <View className="flex-row">
                                <QuantityBox quantity={user.following.length} title={'Following'} />
                                <QuantityBox quantity={user.followers.length} title={'Followers'} />
                                <QuantityBox quantity={user.likesCount} title={'Likes'} />
                            </View>
                            <View className="flex-row gap-3">
                                <Button
                                    title={'Edit profile'}
                                    type="gray"
                                    onPress={() => handleNav('ProfileEditingStack')}
                                />
                                <Button
                                    Icon={<MaterialCommunityIcons name="account-plus-outline" size={25} />}
                                    type={'gray'}
                                />
                            </View>
                            {user.bio && <Text>{user.bio}</Text>}
                        </View>
                        <View className="flex-row mt-5 justify-between fixed">
                            <View
                                className={classNames('px-16', {
                                    'border-b-2': currentSubPage === subPage.post,
                                })}
                                onTouchStart={() => handleSwitchSubPage(subPage.post)}
                            >
                                <MaterialCommunityIcons
                                    name="video"
                                    size={35}
                                    color={currentSubPage !== subPage.post ? '#7d7d7d' : 'black'}
                                />
                            </View>
                            <View
                                className={classNames('px-16', {
                                    'border-b-2': currentSubPage === subPage.mark,
                                })}
                                onTouchStart={() => handleSwitchSubPage(subPage.mark)}
                            >
                                <MaterialCommunityIcons
                                    name="bookmark-outline"
                                    size={35}
                                    color={currentSubPage !== subPage.mark ? '#7d7d7d' : 'black'}
                                />
                            </View>
                        </View>
                        {currentSubPage === 'post' && (
                            <View className="flex-row flex-wrap ">
                                {postedVideos.length > 0 &&
                                    postedVideos.map((video, index) => {
                                        return (
                                            <ProfileVideo
                                                key={index}
                                                thumbnail={video.thumbnailUrl}
                                                viewerQuantity={formatViews(video.viewersCount)}
                                            />
                                        );
                                    })}
                            </View>
                        )}
                        {currentSubPage === 'mark' && (
                            <View className="flex-row flex-wrap ">
                                {markedVideos.length > 0 &&
                                    markedVideos.map((video, index) => {
                                        return (
                                            <ProfileVideo
                                                key={index}
                                                thumbnail={video.thumbnailUrl}
                                                viewerQuantity={formatViews(video.viewersCount)}
                                            />
                                        );
                                    })}
                            </View>
                        )}
                    </View>
                </ProfileLayout>
            ) : (
                <View
                    style={{
                        height: height,
                    }}
                    className="items-center justify-center"
                >
                    <View className="w-[300px] items-center">
                        <MaterialCommunityIcons name="account-outline" size={100} color={'#b6b6b6'} />
                        <Text>Log into existing account</Text>
                        <Button title={'Login'} type={'primary'} onPress={() => navigation.navigate('Login')} />
                    </View>
                </View>
            )}
        </>
    );
}
