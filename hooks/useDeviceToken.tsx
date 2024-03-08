import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {clientSettings} from '@magicbell/react-headless';
import {decode as atob} from 'base-64';

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
    const client = clientSettings.getState().getClient();
    if (!client) {
      return;
    }
    client
      .request({
        method: 'GET',
        path: '/channels/mobile_push/apns/tokens',
      })
      .then((result: string[]) => {
        const r = result.map((x: string) => JSON.parse(atob(x)).device_token);
        if (r.includes(token)) {
          return;
        }
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
          .catch(err => {
            console.log('post token error', err);
          });
      });
  }, [token]);

  return token;
}
