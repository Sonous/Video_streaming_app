import { View, Text, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { UserContext } from '../../context/UserProvider';
import firebase, { auth } from '../../../firebase.config';

export default function Password({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ErrorConfirmPassword, setErrorConfirmPassword] = useState('');
    const { user, setLoading } = useContext(UserContext);

    const handleValidComfirmPass = (input) => {
        if (input && newPassword !== input) {
            setErrorConfirmPassword('Wrong cofirm password');
        } else {
            setErrorConfirmPassword('');
        }
    };

    const handleChangePassword = async () => {
        try {
            setLoading(true);

            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

            await auth.currentUser.reauthenticateWithCredential(credential);

            await auth.currentUser.updatePassword(newPassword);

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Wrong current password');
            } else {
                console.error('Lỗi khi đổi mật khẩu:', error.message);
            }
        }
    };

    return (
        <SettingLayout title={'Password'} navigation={navigation}>
            <View className="gap-5 p-5">
                <View>
                    <Text className="text-lg font-semibold">Current password</Text>
                    <Input state={currentPassword} setState={setCurrentPassword} type={'login'} isPassword />
                </View>
                <View>
                    <Text className="text-lg font-semibold">New password</Text>
                    <Input state={newPassword} setState={setNewPassword} type={'login'} isPassword />
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
                    title={'Change password'}
                    type={'primary'}
                    onPress={handleChangePassword}
                    disabled={!newPassword || !currentPassword || !confirmPassword || !!ErrorConfirmPassword}
                />
            </View>
        </SettingLayout>
    );
}
