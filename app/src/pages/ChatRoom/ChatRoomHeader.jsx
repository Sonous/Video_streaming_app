import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import classNames from 'classnames';

const { width } = Dimensions.get('screen');

export default function ChatRoomHeader({ profilePicture, name, isActive }) {
    const navigation = useNavigation();

    return (
        <View className={`flex-row w-[${width}px] border-b-[1px] border-[#dedede] p-3 items-center`}>
            <View className="flex-1 flex-row gap-3 items-center">
                <Icon name="arrowleft" size={30} onPress={() => navigation.goBack()} />

                <View className="flex-row items-center gap-2">
                    <View>
                        <Image source={{ uri: profilePicture }} className="w-[40px] h-[40px] rounded-full" />
                        <View
                            className={classNames('absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full', {
                                'bg-[#595959]': !isActive,
                                'bg-[#1cf232]': isActive,
                            })}
                        />
                    </View>

                    <Text className="text-lg font-semibold">{name}</Text>
                </View>
            </View>
            <Entypo name="dots-three-horizontal" size={25} />
        </View>
    );
}
