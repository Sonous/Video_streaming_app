import { View, Text } from 'react-native';
import React from 'react';

export default function QuantityBox({ quantity, title }) {
    return (
        <View className="items-center w-[100px]">
            <Text className="font-bold text-lg">{quantity}</Text>
            <Text className="text-lg">{title}</Text>
        </View>
    );
}
