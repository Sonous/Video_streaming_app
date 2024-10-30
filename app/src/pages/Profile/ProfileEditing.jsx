import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import SettingItem from '../Setting/SettingItem';
import { truncateText } from '../../utils';

const data = [
    {
        title: 'Name',
        value: 'Sonous',
        nav: 'NameEditing',
    },
    {
        title: 'Bio',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vestibulum dui.',
        nav: 'BioEditing',
    },
];

export default function ProfileEditing({ navigation }) {
    const handleShowInput = (dest) => {
        navigation.navigate(dest);
    };

    return (
        <SettingLayout title={'Edit Profile'} navigation={navigation}>
            <View className="items-center gap-3">
                <Image source={require('../../assets/images/Sonous.jpg')} className="w-24 h-24 rounded-full" />
                <Text>Change photo</Text>
            </View>
            <View className="p-5 gap-5">
                {data.map((item, index) => (
                    <SettingItem
                        title={item.title}
                        value={truncateText(item.value)}
                        key={index}
                        onPress={() => handleShowInput(item.nav)}
                    />
                ))}
            </View>
        </SettingLayout>
    );
}
