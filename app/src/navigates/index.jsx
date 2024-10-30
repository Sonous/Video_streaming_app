import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomNav from './BottomNav';
import SettingStack from './SettingStack';
import ProfileEditingStack from './ProfileEditingStack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/Forgot';

const Stack = createNativeStackNavigator();

export default function Navigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="BottomNav"
                screenOptions={({ route }) => ({
                    headerShown: false,
                })}
            >
                <Stack.Screen name="BottomNav" component={BottomNav} />
                <Stack.Screen name="SettingStack" component={SettingStack} />
                <Stack.Screen name="ProfileEditingStack" component={ProfileEditingStack} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Forgot" component={Forgot} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
