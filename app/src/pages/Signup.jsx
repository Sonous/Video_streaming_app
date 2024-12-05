import { View, Text } from 'react-native';
import React, { useContext, useState } from 'react';
import SettingLayout from '../layouts/SettingLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail } from '../utils';
import authApi from '../apis/authApi';
import { UserContext } from '../context/UserProvider';

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ErrorEmail, setErrorEmail] = useState('');
    const [ErrorConfirmPassword, setErrorConfirmPassword] = useState('');
    const { setUser, setIsAuth, setLoading } = useContext(UserContext);

    const handleValidEmail = (input) => {
        if (input && !validateEmail(input)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handleValidComfirmPass = (input) => {
        if (input && password !== input) {
            setErrorConfirmPassword('Wrong cofirm password');
        } else {
            setErrorConfirmPassword('');
        }
    };

    const handleSignup = async () => {
        try {
            setLoading(true);

            const user = await authApi.register(email, password);

            setUser(user);
            setIsAuth(true);
            setLoading(false);
            navigation.popToTop();
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavLogin = () => {
        navigation.navigate('Login');
    };

    // Email has already existed!

    return (
        <SettingLayout title={'Signup'} navigation={navigation}>
            <View className="gap-5 p-5">
                <View>
                    <Text className="text-lg font-semibold">Email</Text>
                    <Input state={email} setState={setEmail} type={'login'} onSetInput={handleValidEmail} />
                    {ErrorEmail && <Text className="text-red-600">{ErrorEmail}</Text>}
                </View>
                <View>
                    <Text className="text-lg font-semibold">Password</Text>
                    <Input state={password} setState={setPassword} type={'login'} isPassword />
                </View>
                <View>
                    <Text className="text-lg font-semibold">Confirm password</Text>
                    <Input
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        type={'login'}
                        onSetInput={handleValidComfirmPass}
                        isPassword
                    />
                    {ErrorConfirmPassword && <Text className="text-red-600">{ErrorConfirmPassword}</Text>}
                </View>
                <Button
                    title={'Sign up'}
                    type={'primary'}
                    onPress={handleSignup}
                    disabled={!email || !password || !confirmPassword || !!ErrorEmail || !!ErrorConfirmPassword}
                />

                <View className="flex-row justify-center">
                    <Text>Already have an account? </Text>
                    <View onTouchStart={handleNavLogin}>
                        <Text className="text-blue-600 font-semibold">Log in</Text>
                    </View>
                </View>
            </View>
        </SettingLayout>
    );
}
