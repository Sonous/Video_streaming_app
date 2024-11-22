import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function QuantityBox({ quantity, title, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.8} className="items-center w-[100px]" onPress={onPress}>
            <Text className="font-bold text-lg">{quantity}</Text>
            <Text className="text-lg">{title}</Text>
        </TouchableOpacity>
    );
}
