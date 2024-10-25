import { View, Text } from 'react-native';
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profile() {
    return (
        <MainLayout>
            <View className="p-2">
                <View className="flex-row">
                    <Text className="text-4xl font-semibold flex-1">Profile</Text>
                    <MaterialCommunityIcons name="menu" size={40} />
                </View>
            </View>
        </MainLayout>
    );
}
