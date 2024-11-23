import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import classNames from 'classnames';

export default function Input({
    state,
    setState,
    onSetInput,
    onClearInput,
    type,
    isPassword,
    autofocus = false,
    placeholder,
}) {
    const [hidePassword, setHidePassword] = useState(isPassword);

    const handleSetInput = (value) => {
        setState(value);
        if (typeof onSetInput === 'function') onSetInput(value);
    };

    const handleClearInput = () => {
        setState('');
        if (typeof onClearInput === 'function') onClearInput();
    };

    const handlehidePassword = () => {
        setHidePassword(!hidePassword);
    };

    return (
        <View className="relative">
            <TextInput
                value={state}
                onChangeText={handleSetInput}
                className={classNames('border-b-[1px] border-[#b6b6b6] h-[55px]', {
                    'border-[1px] rounded-lg p-5': type === 'login',
                })}
                secureTextEntry={hidePassword}
                autoFocus={autofocus}
                maxLength={30}
                placeholder={placeholder}
            />
            <View className="absolute right-0 px-3 top-[50%] -translate-y-1/2 flex-row gap-2">
                <View onTouchStart={handleClearInput}>
                    <Icon name="close-circle" size={20} color={'#b6b6b6'} />
                </View>
                {isPassword &&
                    (hidePassword ? (
                        <View onTouchStart={handlehidePassword}>
                            <Icon name="eye-off-outline" size={20} color={'#b6b6b6'} />
                        </View>
                    ) : (
                        <View onTouchStart={handlehidePassword}>
                            <Icon name="eye-outline" size={20} color={'#b6b6b6'} />
                        </View>
                    ))}
            </View>
        </View>
    );
}
