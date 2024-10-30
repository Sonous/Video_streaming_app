import { View, Text } from 'react-native';
import React, { useState } from 'react';
import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogin = () => {
        console.log('jfoiasdjf');
    };

    const handleForgotPass = () => {
        navigation.navigate('Forgot');
    };

    const handleNavSignup = () => {
        navigation.navigate('Signup');
    };

    return (
        <SettingLayout title={'Login'} navigation={navigation}>
            <View className="gap-5 p-5">
                <View>
                    <Text className="text-lg font-semibold">Email</Text>
                    <Input state={email} setState={setEmail} type={'login'} />
                    {isError && <Text className="text-red-600">Wrong email or password!</Text>}
                </View>
                <View>
                    <Text className="text-lg font-semibold">Password</Text>
                    <Input state={password} setState={setPassword} type={'login'} isPassword />
                    {isError && <Text className="text-red-600">Wrong email or password!</Text>}
                </View>
                <View onTouchStart={handleForgotPass}>
                    <Text className="font-semibold">Forgot password?</Text>
                </View>

                <Button title={'Log in'} type={'primary'} onPress={handleLogin} disabled={!email || !password} />

                <View className="flex-row justify-center">
                    <Text>Don't have an account? </Text>
                    <View onTouchStart={handleNavSignup}>
                        <Text className="text-blue-600 font-semibold">Sign up</Text>
                    </View>
                </View>
            </View>
        </SettingLayout>
    );
}
