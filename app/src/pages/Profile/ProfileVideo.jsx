import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileVideo({ thumbnail, viewerQuantity, onPress }) {
    return (
        <TouchableOpacity className="m-1 relative" activeOpacity={0.5} onPress={onPress}>
            <Image source={{ uri: thumbnail }} className="w-[125px] h-[160px]" />
            <View className="absolute z-10 bottom-0 flex-row">
                <MaterialCommunityIcons name="play-outline" color={'white'} size={20} />
                <Text className="text-sm text-white">{viewerQuantity}</Text>
            </View>
        </TouchableOpacity>
    );
}
