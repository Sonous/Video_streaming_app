import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingItem({ iconName, title, onPress, showArrow = true, value }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5} className="flex-row items-center gap-3">
            {iconName && <MaterialCommunityIcons name={iconName} size={25} color={'#828181'} />}
            <Text className="flex-1 font-semibold">{title}</Text>
            {value && <Text>{value}</Text>}
            {showArrow && <MaterialCommunityIcons name={'chevron-right'} size={25} color={'#828181'} />}
        </TouchableOpacity>
    );
}
