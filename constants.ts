import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';

export const colors = {
  bg: {
    app: '#1D1F29',
    app2: '#1E212F',
    default: '#23283B',
    hover: '#21283E',
    active: '#2A314D',
    primary: '#6E56CF',
    primaryHover: '#7C66DC',
    primaryActive: '#7C66DC',
  },
  overlay: '#08090C',
  border: {
    muted: '#354061',
    default: '#3D4A76',
    highlight: '#4D5E94',
  },
  accentPlum: {
    dark: '#AB4ABA',
    light: '#D864D8',
  },
  accentTeal: {
    dark: '#12A594',
    light: '#0AC5B3',
  },
  accentOrange: {
    dark: '#F76808',
    light: '#FF8B3E',
  },
  accentCyan: {
    dark: '#05A2C2',
    light: '#00C2D7',
  },
  accentPink: {
    dark: '#D6409F',
    light: '#F65CB6',
  },
  text: {
    default: '#EDEDEF',
    muted: '#A09FA6',
    highlight: '#FFEF5C',
    link: '#9E8CFC',
    linkHover: '#BCAFFD',
  },
};

export const screenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.bg.app,
  },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  headerTintColor: '#fff',
};

export const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: colors.bg.app,
    flex: 1,
    justifyContent: 'center',
  },
  scrollable: {
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export const routes = {
  splash: 'Splash',
  signIn: 'SignIn',
  home: 'Home',
  details: 'Details',
};

export const config = {
  prod: {
    apiKey: 'd6a3cf19179a45a5daa9ac7f3f37e9d49914d2ad',
    userEmail: 'matt@magicbell.io',
    userHmac: '5n4ooUtzydnYq5GYh6PIWGeP2alepTf/Qgb/Sp/g3Co=',
    serverUrl: 'https://api.magicbell.com',
  },
  local: {
    apiKey: '8cd17191a14339cb1d4e58c4ea471eeca51d2c70',
    userEmail: 'matt@magicbell.io',
    userHmac: '',
    serverUrl: 'https://magicbell-matt.loca.lt',
  },
  review: {
    apiKey: '552efd58f59315d065e45b07f8d8f8a2751c2b5b',
    userEmail: 'matthewoxley001@gmail.com',
    userHmac: '5n4ooUtzydnYq5GYh6PIWGeP2alepTf/Qgb/Sp/g3Co=',
    serverUrl: 'https://api-4374.magicbell.cloud/',
  },
};

export const currentConfig = config.local;
