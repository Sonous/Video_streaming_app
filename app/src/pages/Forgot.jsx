import { View, Text } from 'react-native';
import React, { useState } from 'react';
import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail } from '../utils';

export default function Forgot({ navigation }) {
    const [email, setEmail] = useState('');
    const [ErrorEmail, setErrorEmail] = useState('');

    const handleValidEmail = (input) => {
        if (input && !validateEmail(input)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handleResetPass = () => {
        // if  {
        // }
        console.log('hfisdfi');
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
                        onSetInput={handleValidEmail}
                        placeholder={'Email address'}
                    />
                    {ErrorEmail && <Text className="text-red-600">{ErrorEmail}</Text>}
                </View>
                <Button
                    title={'Reset'}
                    type={'primary'}
                    onPress={handleResetPass}
                    disabled={!email || ErrorEmail || false}
                />
            </View>
        </SettingLayout>
    );
}
