import { View, Text } from 'react-native';
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import firebase, { storage } from '../../firebase.config';

// console.log(new Date());

// const storageRef = storage.ref();
// storageRef
//     .child('videos/test.mp4')
//     .getDownloadURL()
//     .then((res) => console.log(res));

// console.log(process.env.EXPO_PUBLIC_API_KEY);

export default function Home() {
    return (
        <MainLayout>
            <View>
                <Text>Home</Text>
            </View>
        </MainLayout>
    );
}
