import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function EditingLayout({ children, title, navigation, handleSave }) {
    return (
        <View>
            <View className="flex-row justify-between p-3 border-b-[1px] border-[#b6b6b6]">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-lg">Cancel</Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold">{title}</Text>

                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-lg font-semibold text-blue-500">Save</Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    );
}
