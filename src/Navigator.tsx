import React, { useEffect } from 'react';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useCredentials } from './hooks/useAuth';
import { routes } from './constants';

interface IProps {
  loading: React.ReactNode;
  signedOut: React.ReactNode;
  signedIn: React.ReactElement;
}

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function Navigator(props: IProps) {
  const [credentials] = useCredentials();
  const isLoading = typeof credentials === 'undefined';
  const isSignedIn = !!credentials;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={routes.splash}>
        {isLoading ? props.loading : isSignedIn ? props.signedIn : props.signedOut}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
