import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import classNames from 'classnames';

export default function Button({ title, Icon, type, onPress, disabled = false, className }) {
    return (
        <TouchableOpacity
            className={classNames('px-5 py-2 rounded-lg flex flex-row gap-2 justify-center items-center', className, {
                'bg-[#e3e2e2]': type === 'gray',
                'bg-blue-500': type === 'primary',
                'bg-neutral-300': disabled,
            })}
            activeOpacity={0.5}
            onPress={onPress}
            disabled={disabled}
        >
            {Icon}
            {title && (
                <Text
                    className={classNames('font-medium text-lg tracking-wider', {
                        'text-white': type === 'primary',
                        'text-neutral-500': disabled,
                    })}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}
