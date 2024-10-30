import { View, Text } from 'react-native';
import React from 'react';
import SettingLayout from '../../layouts/SettingLayout';

export default function Password({ navigation }) {
    return (
        <SettingLayout title={'Password'} navigation={navigation}>
            <Text>Password</Text>
        </SettingLayout>
    );
}
