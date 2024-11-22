import { View, Text } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Friend from '../pages/Follow/Friend';
import Following from '../pages/Follow/Following';
import Follower from '../pages/Follow/Follower';
import { useRoute } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

export default function FollowStack() {
    const route = useRoute();

    return (
        <Tab.Navigator
            initialRouteName={route.params?.page}
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
            <Tab.Screen name="Following" component={Following} initialParams={{ personId: route.params?.personId }} />
            <Tab.Screen name="Follower" component={Follower} initialParams={{ personId: route.params?.personId }} />
            <Tab.Screen name="Friend" component={Friend} initialParams={{ personId: route.params?.personId }} />
        </Tab.Navigator>
    );
}
