import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import EditingLayout from '../../layouts/EditingLayout';
import classNames from 'classnames';

export default function BioEditing({ navigation }) {
    const [bioInput, setBioInput] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vestibulum dui.',
    );

    const [inputLength, setInputLength] = useState(bioInput.length);

    const handleSetInput = (text) => {
        setBioInput(text);
        setInputLength(text.length);
    };

    return (
        <EditingLayout title={'Bio'} navigation={navigation}>
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
