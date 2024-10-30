import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import classNames from 'classnames';

export default function Button({ title, Icon, type, onPress, disabled = false }) {
    return (
        <TouchableOpacity
            className={classNames('px-5 py-2 rounded-lg flex justify-center items-center', {
                'bg-[#e3e2e2]': type === 'gray',
                'bg-blue-500 w-full': type === 'primary',
                'bg-neutral-300': disabled,
            })}
            activeOpacity={0.5}
            onPress={onPress}
            disabled={disabled}
        >
            {!Icon ? (
                <Text
                    className={classNames('font-medium text-lg', {
                        'text-white': type === 'primary',
                        'text-neutral-500': disabled,
                    })}
                >
                    {title}
                </Text>
            ) : (
                Icon
            )}
        </TouchableOpacity>
    );
}
