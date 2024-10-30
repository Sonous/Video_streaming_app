import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import EditingLayout from '../../layouts/EditingLayout';
import classNames from 'classnames';
import Input from '../../components/Input';

export default function NameEditing({ navigation }) {
    const [nameInput, setNameInput] = useState('Sonous');

    const [inputLength, setInputLength] = useState(nameInput.length);

    const handleSetInput = (name) => {
        setInputLength(name.length);
    };

    const handleClear = () => {
        setInputLength(0);
    };

    return (
        <EditingLayout title={'Name'} navigation={navigation}>
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
