import { registerRootComponent } from 'expo';
import App from './src/App';

// Polyfills for React Native environment
import 'react-native-url-polyfill/auto';

registerRootComponent(App);
