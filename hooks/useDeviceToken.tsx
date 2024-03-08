import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {clientSettings} from '@magicbell/react-headless';
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'MBsavedToken';

export default function useDeviceToken() {
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
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
    AsyncStorage.getItem(key).then(savedToken => {
      if (savedToken === token) {
        return;
      }
      const client = clientSettings.getState().getClient();
      client
        .request({
          method: 'POST',
          path: '/channels/mobile_push/apns/tokens',
          data: {
            apns: {
              device_token: token,
            },
          },
        })
        .then(result => {
          console.log('post token', result);
          AsyncStorage.setItem(key, token);
        })
        .catch(err => {
          console.log('post token error', err);
        });
    });
  }, [token]);

  return token;
}
