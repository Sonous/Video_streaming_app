import { View, Text, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

import { UserContext } from '../../context/UserProvider';
import dbApi from '../../apis/dbApi';
import storageApi from '../../apis/storageApi';

// border-[1px] border-black

export default function ChatInput({ roomId, friendId }) {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');

    const handleSendMessage = async (type = 'text', attachmentUrl = '') => {
        // await dbApi.sendMessage(roomId, friendId, message, type, attachmentUrl);

        await dbApi.sendMessage(roomId, user.userId, message, type, attachmentUrl);
        setMessage('');
    };

    const handleSelectMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        // console.log(result.assets[0].type);

        if (!result.canceled) {
            const uploadProcess = await storageApi.uploadFile(
                result.assets[0].uri,
                `${result.assets[0].type}s/${Date.now()}-${result.assets[0].fileName}`,
            );

            const mediaDowloadUrl = await uploadProcess.promise;

            handleSendMessage(result.assets[0].type, mediaDowloadUrl);
        }
    };

    return (
        <View className="flex-row items-center m-3 p-2 gap-2 bg-white rounded-full">
            <AntDesign name="camera" size={25} color={'white'} className=" bg-cyan-500 p-2 rounded-full" />
            <TextInput
                value={message}
                onChangeText={(value) => setMessage(value)}
                placeholder="Message..."
                onSubmitEditing={() => handleSendMessage()}
                className="flex-1"
            />
            {message ? (
                <MaterialCommunityIcons
                    name="send"
                    color={'white'}
                    size={25}
                    className=" bg-orange-500 p-2 rounded-full "
                    onPress={() => handleSendMessage()}
                />
            ) : (
                <Ionicons name="image-outline" size={30} className="mr-2" onPress={handleSelectMedia} />
            )}
        </View>
    );
}
