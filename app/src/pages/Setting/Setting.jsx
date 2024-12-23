import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import SettingBox from './SettingBox';
import SettingLayout from '../../layouts/SettingLayout';
import authApi from '../../apis/authApi';

const settingItems = [
    {
        label: 'Account',
        items: [
            {
                iconName: 'account',
                title: 'Account',
                nav: 'AccountNav',
            },
        ],
    },
    {
        label: 'Login',
        items: [
            {
                iconName: 'account-switch-outline',
                title: 'Switch account',
            },
            {
                iconName: 'logout',
                title: 'Logout',
                showArrow: false,
                nav: 'BottomNav',
                async onPress(setIsAuth, setUser, userId, setLoading) {
                    try {
                        setLoading(true);
                        await authApi.logout(userId);

                        setUser(null);
                        setIsAuth(false);
                        setLoading(false);
                    } catch (error) {
                        throw error;
                    }
                },
            },
        ],
    },
];

export default function Setting({ navigation }) {
    return (
        <SettingLayout navigation={navigation}>
            {settingItems.map((item, index) => (
                <SettingBox label={item.label} data={item.items} key={index} navigation={navigation} />
            ))}
        </SettingLayout>
    );
}
