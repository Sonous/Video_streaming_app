import { View, Text } from 'react-native';
import React from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import SettingBox from '../Setting/SettingBox';
import { maskPhoneNumber, maskEmail } from '../../utils';

const items = [
    {
        title: 'Phone number',
        showArrow: false,
        value: maskPhoneNumber('0993187299'),
    },
    {
        title: 'Email',
        showArrow: false,
        value: maskEmail('fake@gm.com'),
    },
];

export default function AccountInfomation({ navigation }) {
    return (
        <SettingLayout title={'Account Infomation'} navigation={navigation}>
            <SettingBox data={items} navigation={navigation} />
        </SettingLayout>
    );
}
