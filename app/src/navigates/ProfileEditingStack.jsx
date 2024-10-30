import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileEditing from '../pages/Profile/ProfileEditing';
import NameEditing from '../pages/Profile/NameEditing';
import BioEditing from '../pages/Profile/BioEditing';

const Stack = createNativeStackNavigator();

export default function ProfileEditingStack() {
    return (
        <Stack.Navigator
            initialRouteName="ProfileEditing"
            screenOptions={({ route }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen name="ProfileEditing" component={ProfileEditing} />
            <Stack.Screen name="NameEditing" component={NameEditing} />
            <Stack.Screen name="BioEditing" component={BioEditing} />
        </Stack.Navigator>
    );
}
