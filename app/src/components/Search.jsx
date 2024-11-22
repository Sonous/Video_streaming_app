import { View, Text, TextInput } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import classNames from 'classnames';

export default function Search({ searchValue, setSearchValue, placeholder }) {
    return (
        <View className="flex-row items-center gap-2 px-3 bg-[#e5e5e5] relative rounded-full">
            <Icon name="search1" size={24} color />
            <TextInput
                value={searchValue}
                onChangeText={(value) => setSearchValue(value)}
                placeholder={placeholder}
                className=" flex-1 h-[45px]"
            />
            <Icon
                name="closecircle"
                size={20}
                color={'#616060'}
                className={classNames({
                    'hidden ': !searchValue,
                })}
                onPress={() => setSearchValue('')}
            />
        </View>
    );
}
