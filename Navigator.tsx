import React, {useEffect} from 'react';
import {
  CommonActions,
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PushNotificationIOS, {
  PushNotification,
} from '@react-native-community/push-notification-ios';
import {Platform, StyleSheet} from 'react-native';

import {useCredentials} from './hooks/useAuth';
import {routes} from './constants';

interface IProps {
  loading: React.ReactNode;
  signedOut: React.ReactNode;
  signedIn: React.ReactElement;
}

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
export const onRemoteNotification = (notification: PushNotification) => {
  const isClicked = notification.getData().userInteraction === 1;

  if (isClicked) {
    // Navigate user to details screen
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.navigate(routes.details, {
          title: notification.getMessage(),
          content: notification.getTitle(),
          sentAt: Math.round(Date.now() / 1000) - 1,
        }),
      );
    }
  }
  // Use the appropriate result based on what you needed to do for this notification
  const result = PushNotificationIOS.FetchResult.NoData;
  notification.finish(result);
};

export default function Navigator(props: IProps) {
  const [credentials] = useCredentials();
  const isLoading = typeof credentials === 'undefined';

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const type = 'localNotification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={routes.splash}>
        {isLoading
          ? props.loading
          : !credentials
          ? props.signedOut
          : props.signedIn}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
