import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileLayout({ type, children, navigation }) {
    const handleNavToSetting = () => {
        navigation.navigate('SettingStack');
    };

    return (
        <ScrollView>
            <View>
                {type === 'personal' ? (
                    <View className="flex-row p-2 border-b-[1px] border-[#b6b6b6] mb-3">
                        <Text className="text-2xl font-semibold flex-1">Profile</Text>
                        <TouchableOpacity onPress={handleNavToSetting}>
                            <MaterialCommunityIcons name="menu" size={30} color={'#7a7a7a'} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View></View>
                )}
                {children}
            </View>
        </ScrollView>
    );
}
