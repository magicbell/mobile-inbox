import PushNotificationIOS, { PushNotification } from "@react-native-community/push-notification-ios";

import {navigationRef} from '../Navigator';
import { useEffect } from "react";
import { CommonActions } from "@react-navigation/native";
import { routes } from "../constants";

const onRemoteNotification = (notification: PushNotification) => {
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

  export default function usePushNotificationHandler() {
    useEffect(() => {
        const type = 'localNotification';
        PushNotificationIOS.addEventListener(type, onRemoteNotification);
        return () => {
          PushNotificationIOS.removeEventListener(type);
        };
      }, []);
  }