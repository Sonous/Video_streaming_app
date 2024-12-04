import './global.css';
import 'react-native-gesture-handler';
import Navigator from './src/navigates';
import { ActivityIndicator, StatusBar } from 'react-native';
import UserProvider from './src/context/UserProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Suspense } from 'react';

export default function App() {
    const Stack = createStackNavigator();
    return (
        <UserProvider>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                        <StatusBar translucent={false} backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
                        <Navigator />
                    </Suspense>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </UserProvider>
    );
}
