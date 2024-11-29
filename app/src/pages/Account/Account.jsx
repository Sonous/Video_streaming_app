import React, { useCallback, useState } from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import SettingBox from '../Setting/SettingBox';
import { maskEmail } from '../../utils';
import { auth } from '../../../firebase.config';
import { useFocusEffect } from '@react-navigation/native';

export default function Account({ navigation }) {
    const [item, setItem] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setItem([
                {
                    title: 'Email',
                    showArrow: false,
                    value: auth.currentUser.email ? maskEmail(auth.currentUser.email) : '',
                    onPress: () => {
                        navigation.navigate('ResetEmail');
                    },
                },
                {
                    title: 'Password',
                    nav: 'Password',
                },
            ]);
        }, []),
    );

    return (
        <SettingLayout title="Account" navigation={navigation}>
            <SettingBox data={item} navigation={navigation} />
        </SettingLayout>
    );
}
