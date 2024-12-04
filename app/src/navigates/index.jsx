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
import Preview from '../pages/Upload/Preview';
import AddFriendStack from './AddFriendStack';
import SettingLayout from '../layouts/SettingLayout';
import ChatRoom from '../pages/ChatRoom/ChatRoom';
import Profile from '../pages/Profile/Profile';
import FollowStack from './FollowStack';
import VideoPlayer from '../pages/VideoPlayer';

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
                <Stack.Screen
                    name="AddFriendStack"
                    component={AddFriendStack}
                    options={{
                        headerShown: true,
                        header: ({ navigation }) => <SettingLayout navigation={navigation} title={'Add friends'} />,
                    }}
                />
                <Stack.Screen
                    name="FollowStack"
                    component={FollowStack}
                    options={{
                        headerShown: true,
                        header: ({ navigation }) => (
                            <SettingLayout navigation={navigation} title={'Relationships Info'} />
                        ),
                    }}
                />
                <Stack.Screen name="ChatRoom" component={ChatRoom} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Forgot" component={Forgot} />
                <Stack.Screen name="Preview" component={Preview} />
                <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
