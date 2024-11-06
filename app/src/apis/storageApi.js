import { storage } from '../../firebase.config';

const storageApi = {
    async uploadFile(uri, path) {
        try {
            const res = await fetch(uri);
            const blob = await res.blob();
            const imageRef = storage.ref(path);
            const uploadTask = imageRef.put(blob);

            return {
                cancel() {
                    uploadTask.cancel();
                },
                promise: new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                        },
                        (error) => {
                            // Xử lý lỗi tải lên
                            if (error.code === 'storage/canceled') {
                                console.log('Upload was canceled by the user.');
                            } else {
                                console.error('Upload error:', error);
                            }
                            reject(error);
                        },
                        async () => {
                            // Hoàn tất tải lên, lấy URL tải xuống
                            const downloadURL = await imageRef.getDownloadURL();
                            console.log('Download URL:', downloadURL);
                            resolve(downloadURL);
                        },
                    );
                }),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default storageApi;
