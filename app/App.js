import './global.css';
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import UserProvider from './src/context/UserProvider';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Search from './src/pages/Search';
import VideoPlayer from './src/pages/VideoPlayer';
export default function App() {
    const Stack = createStackNavigator();
    return (
        <UserProvider>
            <StatusBar translucent={false} backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
            {/* <Navigator /> */}
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
                    <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}
