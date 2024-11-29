import { View, Text, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import SettingLayout from '../../layouts/SettingLayout';
import SettingBox from '../Setting/SettingBox';
import EditingLayout from '../../layouts/EditingLayout';
import { UserContext } from '../../context/UserProvider';
import Input from '../../components/Input';
import { auth } from '../../../firebase.config';
import { validateEmail } from '../../utils';
import dbApi from '../../apis/dbApi';

export default function ResetEmail({ navigation }) {
    const [email, setEmail] = useState(auth.currentUser.email);
    const [errorEmail, setErrorEmail] = useState('');

    const handleValidEmail = (input) => {
        if (input && !validateEmail(input)) {
            setErrorEmail('Invalid email address');
        } else {
            setErrorEmail('');
        }
    };

    const handleSave = async () => {
        try {
            await auth.currentUser.updateEmail(email);

            await dbApi.updateUserInfo(auth.currentUser.uid, {
                email,
            });

            Alert.alert('Update successfully!', '', [
                {
                    text: 'Ok',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            // Alert.alert(error.message);
            console.error(error);
        }
    };

    return (
        <EditingLayout
            title={'Reset Email'}
            navigation={navigation}
            handleSave={handleSave}
            disabled={!email || email === auth.currentUser.email || !!errorEmail}
        >
            <View className="p-5">
                <Text className="font-bold">email</Text>
                <Input
                    state={email}
                    setState={setEmail}
                    onSetInput={(value) => {
                        handleValidEmail(value);
                    }}
                    autofocus
                />
                {errorEmail && <Text className="text-red-600">{errorEmail}</Text>}
            </View>
        </EditingLayout>
    );
}
