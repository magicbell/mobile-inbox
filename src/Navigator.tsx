import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Screen } from 'react-native-screens';
import isEqual from 'lodash.isequal';

import MagicBellProvider from './components/MagicBellProvider';
import { colors, routes } from './constants';
import { useCredentials } from './hooks/useAuth';

import Details from './screens/Details';
import HomeScreen from './screens/Home';
import { SignInScreen } from './screens/SignIn';
import { MIN_LOADING_TIME, Splash } from './screens/Splash';
import useReviewCredentials from './hooks/useReviewCredentials';

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

const screenOptions: NativeStackNavigationOptions = {
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
  const [credentials, _, signOut] = useCredentials();
  const reviewCredentials = useReviewCredentials();
  const isSignedIn = !!credentials;

  const [waitForSplash, setWaitForSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Delay splash screen
  useEffect(() => {
    let timer = setTimeout(() => setWaitForSplash(false), MIN_LOADING_TIME);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    const isLoadingCredentials = typeof credentials === 'undefined';
    setIsLoading(isLoadingCredentials || waitForSplash);
  }, [waitForSplash, credentials]);

  // Force a sign out when new credentials arrive via a launch URL
  useEffect(() => {
    if (credentials && reviewCredentials && !isEqual(credentials, reviewCredentials)) {
      signOut();
    }
  }, [credentials, reviewCredentials, signOut]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? <SplashScreen /> : isSignedIn ? <SignedInStack /> : <SignedOutStack />}
    </NavigationContainer>
  );
}
