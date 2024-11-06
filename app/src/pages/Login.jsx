import { View, Text } from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';

import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import authApi from '../apis/authApi';
import { UserContext } from '../context/UserProvider';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const { setUser, setIsAuth } = useContext(UserContext);

    const handleLoginWithEmailPassword = async () => {
        try {
            const user = await authApi.login(email, password);

            setUser(user);
            setIsAuth(true);
            navigation.popToTop();
        } catch (error) {
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

                <Button
                    title={'Log in'}
                    type={'primary'}
                    onPress={handleLoginWithEmailPassword}
                    disabled={!email || !password}
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
