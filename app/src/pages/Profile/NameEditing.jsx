import { View, Text, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import EditingLayout from '../../layouts/EditingLayout';
import classNames from 'classnames';
import Input from '../../components/Input';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';

export default function NameEditing({ navigation }) {
    const { user, setUser } = useContext(UserContext);
    const [nameInput, setNameInput] = useState(user.username);

    const [inputLength, setInputLength] = useState(nameInput.length);

    const handleSetInput = (name) => {
        setInputLength(name.length);
    };

    const handleClear = () => {
        setInputLength(0);
    };

    const handleSave = async () => {
        try {
            await dbApi.updateUserInfo(user.userId, {
                username: nameInput,
            });
            const result = await dbApi.getUserData(user.userId);

            setUser((prev) => ({ ...prev, ...result }));
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EditingLayout title={'Name'} navigation={navigation} handleSave={handleSave}>
            <View className="p-5">
                <Text className="font-bold">Name</Text>
                <Input
                    state={nameInput}
                    setState={setNameInput}
                    onSetInput={handleSetInput}
                    onClearInput={handleClear}
                    autofocus
                />

                <Text className="p-3">
                    <Text
                        className={classNames({
                            'text-red-700': inputLength >= 30,
                        })}
                    >
                        {inputLength}
                    </Text>
                    /30
                </Text>
            </View>
        </EditingLayout>
    );
}
