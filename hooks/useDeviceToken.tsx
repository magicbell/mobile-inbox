import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {clientSettings} from '@magicbell/react-headless';

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
      console.error('Magicbell client expected');
      return;
    }
    console.log('posting token', token);
    client
      .request({
        method: 'POST',
        path: '/channels/mobile_push/apns/tokens',
        data: {
          apns: {
            device_token: token,
            installation_id: "development"
          },
        },
      })
      .catch(err => {
        console.log('post token error', err);
      });
  }, [token]);

  return token;
}
