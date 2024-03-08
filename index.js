/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import EventSource from 'react-native-sse';

import 'react-native-url-polyfill/auto';

global.EventSource = EventSource;

AppRegistry.registerComponent(appName, () => App);
