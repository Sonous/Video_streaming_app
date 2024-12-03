import { View, Text, Image, Dimensions, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import classNames from 'classnames';

import QuantityBox from '../../components/QuantityBox';
import ProfileLayout from '../../layouts/ProfileLayout';
import Button from '../../components/Button';
import ProfileVideo from './ProfileVideo';
import { formatViews } from '../../utils';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import { db } from '../../../firebase.config';
import { useRoute } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const subPage = {
    post: 'post',
    mark: 'mark',
};

export default function Profile({ navigation }) {
    const [currentSubPage, setCurrentSubPage] = useState('post');
    const [postedVideos, setPostedVideos] = useState([]);
    const [markedVideos, setMarkedVideos] = useState([]);

    const [person, setPerson] = useState(null);
    const [relationship, setRelationShip] = useState('stranger');
    const [reload, setReload] = useState(false);
    const { isAuth, user } = useContext(UserContext);
    const route = useRoute();

    // console.log(postedVideos);

    useEffect(() => {
        if (person) {
            const unsubscribePostedVideo = db
                .collection('videos')
                .where('userId', '==', person?.userId)
                .onSnapshot((querySnapshot) => {
                    const videos = [];
                    querySnapshot.forEach((doc) => {
                        videos.push({
                            ...doc.data(),
                            videoId: doc.id,
                        });
                    });
                    setPostedVideos(videos);
                });

            const unsubscribeMarkedVideo = db
                .collection('videos')
                .where('marks', 'array-contains', person?.userId)
                .onSnapshot((querySnapshot) => {
                    setMarkedVideos(
                        querySnapshot.docs.map((doc) => ({
                            ...doc.data(),
                            videoId: doc.id,
                        })),
                    );
                });

            return () => {
                unsubscribePostedVideo();
                unsubscribeMarkedVideo();
            };
        }
    }, [person]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await dbApi.getUserData(route.params?.personId);

                if (user) {
                    const isStayInFollowers = user.followers.includes(data?.userId);
                    const isStayInFollowing = user.following.includes(data?.userId);

                    if (isStayInFollowers && isStayInFollowing) {
                        setRelationShip('friend');
                    } else if (isStayInFollowers) {
                        setRelationShip('follower');
                    } else if (isStayInFollowing) {
                        setRelationShip('following');
                    } else {
                        setRelationShip('stranger');
                    }
                }

                setPerson(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (route.params?.personId) {
            fetchApi();
        } else {
            setPerson(user);
        }
    }, [reload, user]);

    const handleSwitchSubPage = (subPage) => {
        setCurrentSubPage(subPage);
    };

    const handleNav = (dest, params = {}) => {
        navigation.navigate(dest, {
            ...params,
        });
    };

    const handleFollow = async () => {
        if (user) {
            await dbApi.updateUserInfo(person?.userId, {
                followers: [...person.followers, user?.userId],
            });
            await dbApi.updateUserInfo(user?.userId, {
                following: [...user.following, person?.userId],
            });

            setReload(!reload);
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    const handleRemoveFollow = async () => {
        await dbApi.updateUserInfo(person?.userId, {
            followers: person.followers.filter((follower) => follower !== user?.userId),
        });
        await dbApi.updateUserInfo(user?.userId, {
            following: user.following.filter((following) => following !== person?.userId),
        });

        setReload(!reload);
    };

    const handleOpenMessage = () => {
        if (user) {
            navigation.navigate('ChatRoom', {
                friendId: person?.userId,
            });
        } else {
            Alert.alert('Please log into an existing account!');
        }
    };

    // console.log(relationship);
    // console.log(user);

    return (
        <>
            {person && (
                <ProfileLayout
                    type={route.params?.personId ? 'other' : 'personal'}
                    title={person?.name}
                    navigation={navigation}
                >
                    <View className="p-2">
                        <View className="items-center gap-3">
                            <View className="items-center">
                                <Image
                                    source={
                                        person.profilePicture
                                            ? { uri: person.profilePicture }
                                            : require('../../assets/images/avatar_placeholder.png')
                                    }
                                    className="w-24 h-24 rounded-full"
                                />

                                <Text className="text-lg font-semibold text-center">@{person.username}</Text>
                            </View>
                            <View className="flex-row">
                                <QuantityBox
                                    quantity={person?.following.length}
                                    title={'Following'}
                                    onPress={() => {
                                        if (user) {
                                            handleNav('FollowStack', {
                                                page: 'Following',
                                                personId: person?.userId,
                                            });
                                        } else {
                                            Alert.alert('Please log into an existing account!');
                                        }
                                    }}
                                />
                                <QuantityBox
                                    quantity={person?.followers.length}
                                    title={'Follower'}
                                    onPress={() => {
                                        if (user) {
                                            handleNav('FollowStack', {
                                                page: 'Follower',
                                                personId: person?.userId,
                                            });
                                        } else {
                                            Alert.alert('Please log into an existing account!');
                                        }
                                    }}
                                />
                                <QuantityBox quantity={person?.likesCount} title={'Likes'} />
                            </View>
                            <View className="flex-row gap-2">
                                {person?.userId !== user?.userId ? (
                                    <>
                                        {!['friend', 'following'].includes(relationship) && (
                                            <Button
                                                title={relationship === 'follower' ? 'Follow back' : 'Follow'}
                                                type={'primary'}
                                                onPress={handleFollow}
                                            />
                                        )}
                                        <Button
                                            Icon={<MaterialCommunityIcons name={'send'} size={25} />}
                                            title={'Message'}
                                            type={'gray'}
                                            onPress={handleOpenMessage}
                                        />
                                        {['friend', 'following'].includes(relationship) && (
                                            <Button
                                                Icon={
                                                    <MaterialCommunityIcons
                                                        name={
                                                            relationship === 'friend'
                                                                ? 'account-multiple'
                                                                : 'account-check'
                                                        }
                                                        size={25}
                                                    />
                                                }
                                                type={'gray'}
                                                onPress={handleRemoveFollow}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            title={'Edit profile'}
                                            type="gray"
                                            onPress={() => handleNav('ProfileEditingStack')}
                                        />
                                        <Button
                                            Icon={<Icon name="adduser" size={25} />}
                                            type="gray"
                                            onPress={() => navigation.navigate('AddFriendStack')}
                                        />
                                    </>
                                )}
                            </View>
                            {person.bio && <Text>{person.bio}</Text>}
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
                                                onPress={() =>
                                                    handleNav('ShowVideo', {
                                                        videos: postedVideos,
                                                        initVideoId: video.videoId,
                                                    })
                                                }
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
                                                onPress={() =>
                                                    handleNav('ShowVideo', {
                                                        videos: markedVideos,
                                                        initVideoId: video.videoId,
                                                    })
                                                }
                                            />
                                        );
                                    })}
                            </View>
                        )}
                    </View>
                </ProfileLayout>
            )}

            {!route.params?.personId && !person && (
                <View
                    style={{
                        height: height,
                    }}
                    className="items-center justify-center"
                >
                    <View className="w-[300px] items-center">
                        <MaterialCommunityIcons name="account-outline" size={100} color={'#b6b6b6'} />
                        <Text>Log into existing account</Text>
                        <Button
                            title={'Login'}
                            type={'primary'}
                            onPress={() => navigation.navigate('Login')}
                            className="w-full"
                        />
                    </View>
                </View>
            )}
        </>
    );
}
