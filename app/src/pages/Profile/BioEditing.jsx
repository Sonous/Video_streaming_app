import { View, Text, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import EditingLayout from '../../layouts/EditingLayout';
import classNames from 'classnames';
import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';

export default function BioEditing({ navigation }) {
    const { user, setUser } = useContext(UserContext);
    const [bioInput, setBioInput] = useState(user.bio);

    const [inputLength, setInputLength] = useState(bioInput.length);

    const handleSetInput = (text) => {
        setBioInput(text);
        setInputLength(text.length);
    };

    const handleSave = async () => {
        try {
            await dbApi.updateUserInfo(user.userId, {
                bio: bioInput,
            });
            const result = await dbApi.getUserData(user.userId);

            setUser((prev) => ({ ...prev, ...result }));
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EditingLayout title={'Bio'} navigation={navigation} handleSave={handleSave}>
            <TextInput
                value={bioInput}
                onChangeText={handleSetInput}
                autoFocus
                multiline
                maxLength={80}
                className="border-b-[1px] border-[#b6b6b6] h-[150px] align-top p-3"
            />
            <Text className="p-3">
                <Text
                    className={classNames({
                        'text-red-700': inputLength >= 80,
                    })}
                >
                    {inputLength}
                </Text>
                /80
            </Text>
        </EditingLayout>
    );
}
