import './global.css';
import 'react-native-gesture-handler';
import Navigator from './src/navigates';
import { StatusBar } from 'react-native';

export default function App() {
    return (
        <>
            <StatusBar translucent={false} />
            <Navigator />
        </>
    );
}
