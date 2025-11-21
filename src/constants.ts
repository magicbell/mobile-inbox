import { StyleSheet } from 'react-native';
import { Credentials } from './hooks/useAuth';

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
  signIn: 'SignIn',
  home: 'Home',
  details: 'Details',
};

export const config: { [key: string]: Credentials } = {
  prod: {
    serverURL: 'https://api.magicbell.com/v2',
    userJWT:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjpudWxsLCJ1c2VyX2V4dGVybmFsX2lkIjoiN2Y0YmFhYjUtMGM5MS00NGU4LThiNTgtNWZmODQ5NTM1MTc0IiwiYXBpX2tleSI6IjVmNWNmYjI5NTEzODQ2NDMzZTgxYjkxZWM1ZTkwOGM5NDNmZjYwNTgiLCJpYXQiOjE3NjM1NDMyOTksImV4cCI6MTc2MzYyOTY5OX0.NzZcuIv_g-nW0JAhF0i_pH4T96BHCfkdjkJOLnqvF6M',
  },
  local: {
    serverURL: 'https://1b35-79-153-3-135.ngrok-free.app',
    userJWT: '',
  },
  review: {
    serverURL: 'https://api-4374.magicbell.cloud/',
    userJWT: '',
  },
};

export const currentConfig = config.local;
