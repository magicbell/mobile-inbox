import { AppRegistry } from 'react-native';
import App from './src/App';

// Polyfills needed for @magicbell/react-headless
import EventSource from 'react-native-sse';
import 'react-native-url-polyfill/auto';
global.EventSource = EventSource;

AppRegistry.registerComponent('MobileInbox', () => App);
