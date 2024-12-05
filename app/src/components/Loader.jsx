import { View, ActivityIndicator, Dimensions } from 'react-native';
import React from 'react';

const { height } = Dimensions.get('window');

export default function Loader() {
    return (
        <View className="absolute z-50 bg-[#00000080] w-full" style={{ height: height }}>
            <ActivityIndicator size={'large'} className="items-center flex-1" />
        </View>
    );
}
