import { View, Text } from 'react-native';
import React from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import SettingBox from '../Setting/SettingBox';

const accountItems = [
    {
        title: 'Account infomation',
        nav: 'AccountInformation',
    },
    {
        title: 'Password',
        nav: 'Password',
    },
];

export default function Account({ navigation }) {
    return (
        <SettingLayout title="Account" navigation={navigation}>
            <SettingBox data={accountItems} navigation={navigation} />
        </SettingLayout>
    );
}
