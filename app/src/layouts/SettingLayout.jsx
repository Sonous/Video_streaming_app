import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import classNames from 'classnames';

export default function SettingLayout({ children, title, navigation, className, onPress }) {
    return (
        // <ScrollView>
        <View>
            <View
                className={classNames(className, {
                    'flex-row items-center py-5 px-3': title,
                })}
            >
                <View
                    className={classNames('py-5 px-3', {
                        'absolute z-10 ': title,
                    })}
                    onTouchStart={() => {
                        if (typeof onPress === 'function') onPress();
                        navigation.goBack();
                    }}
                >
                    <MaterialCommunityIcons name="arrow-left" size={30} />
                </View>
                <Text
                    className={classNames('text-4xl font-bold ml-7', {
                        'text-center align-middle flex-1 !ml-0 !text-lg ': title,
                    })}
                >
                    {title ? `${title}` : 'Setting'}
                </Text>
            </View>
            {children}
        </View>
        // </ScrollView>
    );
}
