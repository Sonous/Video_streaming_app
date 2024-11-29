import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail } from '../utils';
import { auth } from '../../firebase.config';

export default function Forgot({ navigation }) {
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const handleValidEmail = (input) => {
        if (input && !validateEmail(input)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handleResetPass = async () => {
        try {
            await auth.sendPasswordResetEmail(email);

            Alert.alert('Email sent', 'Please check your email', [
                {
                    text: 'Ok',
                    onPress: () => navigation.navigate('Login'),
                },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SettingLayout title={'Reset'} navigation={navigation}>
            <View className="gap-5 p-5">
                <View>
                    <Text className="text-lg font-semibold">Forgot password</Text>
                    <Text className="mb-5">We'll email you a code to reset your password</Text>
                    <Input
                        state={email}
                        setState={setEmail}
                        type={'login'}
                        onSetInput={(value) => {
                            handleValidEmail(value);
                        }}
                        placeholder={'Email address'}
                    />
                    {errorEmail && <Text className="text-red-600">{errorEmail}</Text>}
                </View>
                <Button title={'Reset'} type={'primary'} onPress={handleResetPass} disabled={!email || !!errorEmail} />
            </View>
        </SettingLayout>
    );
}
