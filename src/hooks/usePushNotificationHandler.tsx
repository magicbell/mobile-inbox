import PushNotificationIOS, { PushNotification } from '@react-native-community/push-notification-ios';

import { navigationRef } from '../Navigator';
import { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { routes } from '../constants';
import {
  DEFAULT_ACTION_IDENTIFIER,
  Notification,
  addNotificationResponseReceivedListener,
  setNotificationHandler,
} from 'expo-notifications';

// globally declaring how to handle notifications when the app is in foreground
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const onRemoteNotification = (notification: Notification) => {
  const content = notification.request.content;

  // Navigate user to details screen
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate(routes.details, {
        title: content.title,
        content: content.body,
        sentAt: Math.round(Date.now() / 1000) - 1,
      }),
    );
  }
};

export default function usePushNotificationHandler() {
  useEffect(() => {
    const subscription = addNotificationResponseReceivedListener((event) => {
      if (event.actionIdentifier === DEFAULT_ACTION_IDENTIFIER) {
        onRemoteNotification(event.notification);
      }
    });
    return () => subscription.remove();
  }, []);
}
