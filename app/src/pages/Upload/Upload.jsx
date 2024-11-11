import { View, Text, Dimensions, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as VideoThumbnails from 'expo-video-thumbnails';

import Button from '../../components/Button';
import { UserContext } from '../../context/UserProvider';

const { height } = Dimensions.get('window');

export default function Upload({ navigation }) {
    const { isAuth, user } = useContext(UserContext);

    const generateThumbnail = async (videoUri) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
                time: 0,
            });

            return uri;
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectVideo = async () => {
        if (!isAuth) {
            Alert.alert('Please log into an existing account!');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                quality: 1,
            });

            if (!result.canceled) {
                const uri = await generateThumbnail(result.assets[0].uri);

                navigation.navigate('Preview', {
                    videoObj: result.assets[0],
                    videoThumbnail: uri,
                    userId: user.userId,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ height: height }} className="justify-center items-center">
            <View className="w-[200px] items-center">
                <Icon name="cloud-upload" size={100} color={'#b6b6b6'} />
                <Button title={'Select video'} type={'primary'} onPress={handleSelectVideo} />
            </View>
        </View>
    );
}
