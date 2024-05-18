import React, { useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Credentials } from './useAuth';
import { UserClient } from 'magicbell/user-client';

const installationId = () => "development"

const clientWithCredentials = (credentials: Credentials) => new UserClient({
  apiKey: credentials.apiKey,
  userEmail: credentials.userEmail,
  userHmac: credentials.userHmac,
  host: credentials.serverURL,
})

const unregisterTokenWithCredentials = async (token: string, credentials: Credentials) => {
  console.log('deleting token', token);
  const client = clientWithCredentials(credentials)
  console.log(client)
  client
    .request({
      method: 'DELETE',
      path: '/channels/mobile_push/apns/tokens/' + token
    })
    .catch(err => {
      console.log('delete token error', err);
    });
}

const registerTokenWithCredentials = async (token: string, credentials: Credentials) => {
  console.log('posting token', token);
  const client = clientWithCredentials(credentials)
  console.log(client)
  client
    .request({
      method: 'POST',
      path: '/channels/mobile_push/apns/tokens',
      data: {
        apns: {
          device_token: token,
          installation_id: installationId()
        },
      },
    })
    .catch(err => {
      console.log('post token error', err);
    });
}

export default function useDeviceToken(credentials: Credentials | null | undefined) {
  const [token, setToken] = React.useState<string | null>(null);
  const [credentialsUsedToRegister, setCredentialsUsedToRegister] = React.useState<Credentials | null>(null);

  useEffect(() => {
    PushNotificationIOS.requestPermissions().then(permissions => {
      console.log('permissions', permissions);
    });
    PushNotificationIOS.addEventListener('register', (t: string) => {
      setToken(t);
    });
  }, []);

  useEffect(() => {
    // No token, nothing to register/unregister
    if (!token) {
      return;
    }
    const loginChanged = credentialsUsedToRegister !== credentials
    // If the credentials didn't change, we don't need to register/unregister
    if (!loginChanged) {
      return;
    }

    // The token was previously registered and needs to be unregistered after the login changed
    // (i.e. when logging in as a different user, or logging out)
    if (credentialsUsedToRegister) {
      unregisterTokenWithCredentials(token, credentialsUsedToRegister)
      setCredentialsUsedToRegister(null)
    }
    
    // We're logged in (after a logout, or after logging in as a new user) and need to register the token
    if (credentials) {
      registerTokenWithCredentials(token, credentials)
      setCredentialsUsedToRegister(credentials)
    }
  }, [token, credentials, credentialsUsedToRegister]);

  return token;
}
