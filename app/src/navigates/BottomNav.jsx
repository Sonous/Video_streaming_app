import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Upload from '../pages/Upload';
import Profile from '../pages/Profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomStack = createBottomTabNavigator();

export default function BottomNav() {
    return (
        <BottomStack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Upload') {
                        iconName = focused ? 'plus-box' : 'plus-box-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
                },
            })}
        >
            <BottomStack.Screen name="Home" component={Home} />
            <BottomStack.Screen name="Upload" component={Upload} />
            <BottomStack.Screen name="Profile" component={Profile} />
        </BottomStack.Navigator>
    );
}
