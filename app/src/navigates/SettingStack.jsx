import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../pages/Setting/Setting';
import Account from '../pages/Account/Account';
import AccountInfomation from '../pages/Account/AccountInfomation';
import Password from '../pages/Account/Password';

const Stack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();

const AccountNav = () => (
    <AccountStack.Navigator
        initialRouteName="Account"
        screenOptions={({ route }) => ({
            headerShown: false,
        })}
    >
        <AccountStack.Screen name="Account" component={Account} />
        <AccountStack.Screen name="AccountInformation" component={AccountInfomation} />
        <AccountStack.Screen name="Password" component={Password} />
    </AccountStack.Navigator>
);

export default function SettingStack() {
    return (
        <Stack.Navigator
            initialRouteName="Setting"
            screenOptions={({ route }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="AccountNav" component={AccountNav} />
        </Stack.Navigator>
    );
}
