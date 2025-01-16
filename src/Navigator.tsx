import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Screen } from 'react-native-screens';

import MagicBellProvider from './components/MagicBellProvider';
import { colors, routes } from './constants';
import { useCredentials } from './hooks/useAuth';

import Details from './screens/Details';
import HomeScreen from './screens/Home';
import { SignInScreen } from './screens/SignIn';
import { MIN_LOADING_TIME, Splash } from './screens/Splash';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

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

const SplashScreen = () => (
  <Screen>
    <Splash />
  </Screen>
);

const SignedInStack = () => (
  <MagicBellProvider>
    <Stack.Navigator initialRouteName={routes.home}>
      <Stack.Screen
        name={routes.home}
        component={HomeScreen}
        options={{
          ...screenOptions,
          title: 'Notifications',
        }}
      />
      <Stack.Screen name={routes.details} component={Details} options={{ ...screenOptions }} />
    </Stack.Navigator>
  </MagicBellProvider>
);

const SignedOutStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.signIn}
      component={SignInScreen}
      options={{
        ...screenOptions,
        title: 'Sign in',
      }}
    />
  </Stack.Navigator>
);

interface IProps {}
export default function Navigator({}: IProps) {
  const [credentials] = useCredentials();
  const isSignedIn = !!credentials;

  const [waitForSplash, setWaitForSpash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.warn('mount Navigator');
    let timer = setTimeout(() => setWaitForSpash(false), MIN_LOADING_TIME);
    return () => {
      console.warn('unmount Navigator');
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    setIsLoading(typeof credentials === 'undefined' || waitForSplash);
  }, [waitForSplash, credentials]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? <SplashScreen /> : isSignedIn ? <SignedInStack /> : <SignedOutStack />}
    </NavigationContainer>
  );
}
