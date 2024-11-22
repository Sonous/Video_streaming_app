import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileLayout({ type, children, navigation, title }) {
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
                    <View>
                        <View className="flex-row items-center py-5 px-3">
                            <View
                                className="py-5 px-3 absolute z-10"
                                onTouchStart={() => {
                                    navigation.goBack();
                                }}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={30} />
                            </View>
                            <Text className=" font-bold  text-center align-middle flex-1 !ml-0 !text-lg">{title}</Text>
                        </View>
                    </View>
                )}
                {children}
            </View>
        </ScrollView>
    );
}
