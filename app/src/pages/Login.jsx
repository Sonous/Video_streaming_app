import { View, Text } from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';

import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authApi from '../apis/authApi';
import { UserContext } from '../context/UserProvider';
import { validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const { setUser, setIsAuth } = useContext(UserContext);

    const handleValidEmail = (input) => {
        if (input && !validateEmail(input)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handleLoginWithEmailPassword = async () => {
        try {
            const user = await authApi.login(email, password);

            AsyncStorage.setItem('userId', user.userId);

            setUser(user);
            setIsAuth(true);
            navigation.popToTop();
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setIsError(true);
                return;
            }

            console.error(error);
        }
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
                    <Input
                        state={email}
                        setState={setEmail}
                        type={'login'}
                        onSetInput={(value) => {
                            setIsError(false);
                            handleValidEmail(value);
                        }}
                    />
                    {(isError || errorEmail) && (
                        <Text className="text-red-600">{isError ? 'Wrong email or password!' : errorEmail}</Text>
                    )}
                </View>
                <View>
                    <Text className="text-lg font-semibold">Password</Text>
                    <Input
                        state={password}
                        setState={setPassword}
                        type={'login'}
                        isPassword
                        onSetInput={() => setIsError(false)}
                    />
                    {isError && <Text className="text-red-600">Wrong email or password!</Text>}
                </View>
                <View className="flex-row">
                    <Text className="font-semibold" onTouchStart={handleForgotPass}>
                        Forgot password?
                    </Text>
                </View>

                <Button
                    title={'Log in'}
                    type={'primary'}
                    onPress={handleLoginWithEmailPassword}
                    disabled={!email || !password || errorEmail || false}

                />

                <View className="flex-row justify-center">
                    <Text>Don't have an account? </Text>
                    <View onTouchStart={handleNavSignup}>
                        <Text className="text-blue-600 font-semibold">Sign up</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="border-[1px] border-black items-center rounded-lg bg-neutral-200 p-2"
                    activeOpacity={0.5}
                    // onPress={handelLoginWith }
                >
                    <View className="flex-row gap-3 items-center">
                        <Icon name="github" size={30} />
                        <Text>Sign in with Github</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SettingLayout>
    );
}
