import './global.css';
import 'react-native-gesture-handler';
import Navigator from './src/navigates';
import { StatusBar } from 'react-native';
import UserProvider from './src/context/UserProvider';

export default function App() {
    return (
        <UserProvider>
            <StatusBar translucent={false} backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
            <Navigator />
        </UserProvider>
    );
}
