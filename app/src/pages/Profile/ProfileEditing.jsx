import { View, Text, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import SettingLayout from '../../layouts/SettingLayout';
import SettingItem from '../Setting/SettingItem';
import { truncateText } from '../../utils';
import { UserContext } from '../../context/UserProvider';
import { TouchableOpacity } from 'react-native';
import storageApi from '../../apis/storageApi';
import dbApi from '../../apis/dbApi';

export default function ProfileEditing({ navigation }) {
    const { user, setUser } = useContext(UserContext);

    const handleShowInput = (dest) => {
        navigation.navigate(dest);
    };

    const handleUploadAvatar = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                mediaTypes: ['images'],
                quality: 1,
            });

            if (!result.canceled) {
                const avatarProcess = await storageApi.uploadFile(
                    result.assets[0].uri,
                    `images/${result.assets[0].fileName}`,
                );

                const avatarDownloadUrl = await avatarProcess.promise;

                await dbApi.updateUserInfo(user.userId, {
                    profilePicture: avatarDownloadUrl,
                });

                const newUserInfo = await dbApi.getUserData(user.userId);

                setUser((prev) => ({ ...prev, ...newUserInfo }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SettingLayout title={'Edit Profile'} navigation={navigation}>
            <View className="items-center gap-3">
                <Image
                    source={
                        user.profilePicture
                            ? { uri: user.profilePicture }
                            : require('../../assets/images/avatar_placeholder.png')
                    }
                    className="w-24 h-24 rounded-full"
                />
                <TouchableOpacity onPress={handleUploadAvatar}>
                    <Text>Change photo</Text>
                </TouchableOpacity>
            </View>
            <View className="p-5 gap-5">
                <SettingItem
                    title={'Name'}
                    value={truncateText(user.name)}
                    onPress={() => handleShowInput('NameEditing')}
                />
                <SettingItem
                    title={'Bio'}
                    value={truncateText(user.bio)}
                    onPress={() => handleShowInput('BioEditing')}
                />
            </View>
        </SettingLayout>
    );
}
