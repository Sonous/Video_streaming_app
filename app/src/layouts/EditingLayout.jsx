import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import classNames from 'classnames';

export default function EditingLayout({ children, title, navigation, handleSave, disabled = false }) {
    return (
        <View>
            <View className="flex-row justify-between p-3 border-b-[1px] border-[#b6b6b6]">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-lg">Cancel</Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold">{title}</Text>

                <TouchableOpacity onPress={handleSave} disabled={disabled}>
                    <Text
                        className={classNames('text-lg font-semibold text-blue-500', {
                            '!text-[#7a7a7a]': disabled,
                        })}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    );
}
