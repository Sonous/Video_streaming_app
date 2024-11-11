import { View, Text, Dimensions, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

import SettingLayout from '../../layouts/SettingLayout';
import Button from '../../components/Button';
import storageApi from '../../apis/storageApi';
import Loader from '../../components/Loader';
import dbApi from '../../apis/dbApi';

const { height } = Dimensions.get('window');

export default function Preview({ navigation }) {
    const { videoObj, videoThumbnail, userId } = useRoute().params;
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [objUploadingThumbnail, setObjUploadingThumbnail] = useState();
    const [objUploadingVideo, setObjUploadingVideo] = useState();

    const handlePostVideo = async () => {
        try {
            console.log('uploading...');
            setIsLoading(true);

            const videoProcess = await storageApi.uploadFile(
                videoObj.uri,
                `videos/video-${Date.now()}-${videoObj.fileName}`,
            );
            const thumbnailProcess = await storageApi.uploadFile(videoThumbnail, `images/image-${Date.now()}.jpg`);

            setObjUploadingVideo(videoProcess);
            setObjUploadingThumbnail(thumbnailProcess);

            const videoDowloadUrl = await videoProcess.promise;
            const thumbnailDowloadUrl = await thumbnailProcess.promise;

            // Save video info to db
            const video = await dbApi.saveVideoInfo(userId, videoDowloadUrl, thumbnailDowloadUrl, description);

            setIsLoading(false);
            console.log('upload successfully!');

            navigation.goBack();
        } catch (error) {
            if (error.code === 'storage/canceled') {
                console.log('User canceled the upload.');
            } else {
                console.error('Upload failed:', error);
            }
        }
    };

    return (
        <SettingLayout
            navigation={navigation}
            title={'Preview'}
            className={'absolute'}
            onPress={() => {
                if (objUploadingThumbnail && objUploadingVideo) {
                    objUploadingThumbnail.cancel();
                    objUploadingVideo.cancel();
                }
            }}
        >
            <View className="justify-center items-center " style={{ height: height }}>
                <View className="w-[300px] gap-5 pb-6 px-3 items-center">
                    <Image source={{ uri: videoThumbnail }} className="w-[230px] h-[350px] rounded-xl " />
                    <View className="gap-2">
                        <Text className="text-lg font-medium">Description</Text>
                        <TextInput
                            placeholder="Add description"
                            multiline
                            value={description}
                            onChangeText={(value) => setDescription(value)}
                            className="h-[200px] align-top overflow-y-auto w-[300px] border-[1px] border-[#b6b6b6] rounded-lg p-3"
                        />
                    </View>
                    <Button title={'Post'} type={'primary'} onPress={handlePostVideo} />
                </View>
                {isLoading && <Loader />}
            </View>
        </SettingLayout>
    );
}
