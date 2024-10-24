import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomNav from './BottomNav';

export default function Navigator() {
    return (
        <NavigationContainer>
            <BottomNav />
        </NavigationContainer>
    );
}
