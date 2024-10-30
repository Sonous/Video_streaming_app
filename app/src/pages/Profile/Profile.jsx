import { View, Text, Image, Button as RNButton, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import classNames from 'classnames';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

import QuantityBox from '../../components/QuantityBox';
import ProfileLayout from '../../layouts/ProfileLayout';
import Button from '../../components/Button';
import ProfileVideo from './ProfileVideo';
import { formatViews } from '../../utils';
import { UserContext } from '../../context/UserProvider';

const { height } = Dimensions.get('window');

const profile = {
    usename: 'Sonous',
    avatar: require('../../assets/images/Sonous.jpg'),
    following: 100,
    followers: 0,
    likes: 0,
    bio: "Hello I'm a UITer",
    posts: [
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail0.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Ftest.mp4?alt=media&token=b1e3f7fe-1354-4313-b939-0abf55df5097',
            viewer: 12934823,
        },
        {
            thumbnail: 'file:///data/user/0/host.exp.exponent/files/thumbnail1.jpg',
            url: 'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
            viewer: 2900,
        },
    ],
};

const subPage = {
    post: 'post',
    mark: 'mark',
};

export default function Profile({ navigation }) {
    const [currentSubPage, setCurrentSubPage] = useState('post');
    const [image, setImage] = useState(null);
    const { isAuth } = useContext(UserContext);

    // console.log(isSticky);

    // const generateThumbnail = async (url, index) => {
    //     try {
    //         const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
    //             time: 0,
    //         });
    //         const fileUri = `${FileSystem.documentDirectory}thumbnail${index}.jpg`;
    //         const result = await FileSystem.moveAsync({
    //             from: uri,
    //             to: fileUri,
    //         });

    //         setImage(result);
    //     } catch (e) {
    //         console.warn(e);
    //     }
    // };

    const handleSwitchSubPage = (subPage) => {
        setCurrentSubPage(subPage);
    };

    const handleNav = (dest) => {
        navigation.navigate(dest);
    };

    return (
        <>
            {isAuth ? (
                <ProfileLayout type="personal" navigation={navigation}>
                    <View className="p-2">
                        <View className="items-center gap-3">
                            <View>
                                <Image source={profile.avatar} className="w-24 h-24 rounded-full" />
                                <Text className="text-lg font-semibold text-center">{profile.usename}</Text>
                            </View>
                            <View className="flex-row">
                                <QuantityBox quantity={profile.following} title={'Following'} />
                                <QuantityBox quantity={profile.followers} title={'Followers'} />
                                <QuantityBox quantity={profile.likes} title={'Likes'} />
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
                            {profile.bio && <Text>{profile.bio}</Text>}
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
                        <View className="flex-row flex-wrap ">
                            {profile.posts.map((video, index) => {
                                return (
                                    <ProfileVideo
                                        key={index}
                                        thumbnail={video.thumbnail}
                                        viewerQuantity={formatViews(video.viewer)}
                                    />
                                );
                            })}
                            {/* <RNButton
                            title="press"
                            onPress={() =>
                                generateThumbnail(
                                    'https://firebasestorage.googleapis.com/v0/b/video-streaming-app-b4672.appspot.com/o/videos%2Fvideo2.mp4?alt=media&token=f587bced-13f9-484c-a2a9-a9ece6912bda',
                                    1,
                                )
                            }
                        /> */}
                        </View>
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
