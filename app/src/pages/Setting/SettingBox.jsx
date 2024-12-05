import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import SettingItem from './SettingItem';
import { UserContext } from '../../context/UserProvider';

export default function SettingBox({ label, data, navigation }) {
    const { setIsAuth, setUser, user, setLoading } = useContext(UserContext);

    const handleEvent = (item) => {
        if (item.nav) {
            if (item.title === 'Logout') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomNav' }],
                });
                return;
            }

            navigation.navigate(`${item.nav}`);
            return;
        }
    };

    return (
        <View className="mx-2 mt-5">
            {label && <Text className="ml-7 mb-2">{label}</Text>}
            <View className="bg-white p-5 rounded-lg gap-5">
                {data.map((item, index) => (
                    <SettingItem
                        key={index}
                        iconName={item.iconName}
                        title={item.title}
                        showArrow={item.showArrow}
                        value={item.value}
                        onPress={async () => {
                            try {
                                if (typeof item.onPress === 'function') {
                                    await item.onPress(setIsAuth, setUser, user.userId, setLoading);
                                }

                                handleEvent(item);
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    />
                ))}
            </View>
        </View>
    );
}
