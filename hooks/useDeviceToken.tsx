import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {clientSettings} from '@magicbell/react-headless';
import {decode as atob} from 'base-64';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {request, PERMISSIONS} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token: any) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification: any) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification: any) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err: any) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

export default function useDeviceToken() {
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    messaging()
      .getToken()
      .then((t: any) => {
        console.log('got a token', t);
        setToken(t);
      });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
      console.log('result for android', result);
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    PushNotificationIOS.requestPermissions().then(permissions => {
      console.log('permissions', permissions);
    });
    PushNotificationIOS.addEventListener('register', (t: string) => {
      setToken(t);
    });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const client = clientSettings.getState().getClient();
    if (!client) {
      return;
    }
    client
      .request({
        method: 'GET',
        path: `/channels/mobile_push/${
          Platform.OS === 'ios' ? 'apns' : 'fcm'
        }/tokens`,
      })
      .then((result: {mobile_push: any[]}) => {
        const r = result.mobile_push.map((t: any) => t.device_token);
        if (r.includes(token)) {
          return;
        }
        console.log('posting token', token);
        client
          .request({
            method: 'POST',
            path: `/channels/mobile_push/${
              Platform.OS === 'ios' ? 'apns' : 'fcm'
            }/tokens`,
            data: {
              [Platform.OS === 'ios' ? 'apns' : 'fcm']: {
                device_token: token,
                installation_id: __DEV__ ? 'development' : 'production',
              },
            },
          })
          .catch(err => {
            console.log('post token error', err);
          });
      });
  }, [token]);

  return token;
}
