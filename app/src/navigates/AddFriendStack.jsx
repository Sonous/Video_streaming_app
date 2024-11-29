import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Friend from '../pages/Follow/Friend';
import SuggestedFriend from '../pages/Follow/SuggestedFriend';
import { UserContext } from '../context/UserProvider';

const Tab = createMaterialTopTabNavigator();

export default function AddFriendStack() {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#f0f0f0',
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'semibold',
                },
                tabBarInactiveTintColor: 'black',
                tabBarIndicatorStyle: {
                    backgroundColor: 'black',
                },
                tabBarPressColor: 'transparent',
            }}
        >
            <Tab.Screen name="Friend" component={Friend} initialParams={{ personId: user.userId }} />
            <Tab.Screen name="Suggested" component={SuggestedFriend} />
        </Tab.Navigator>
    );
}
