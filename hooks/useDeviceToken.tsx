import React, { useEffect } from 'react';
import { DevicePushToken, getDevicePushTokenAsync, requestPermissionsAsync } from 'expo-notifications'
import { getIosPushNotificationServiceEnvironmentAsync } from 'expo-application';
import { Credentials } from './useAuth';
import { UserClient } from 'magicbell/user-client';
import { Platform } from 'react-native';

const clientWithCredentials = (credentials: Credentials) => new UserClient({
  apiKey: credentials.apiKey,
  userEmail: credentials.userEmail,
  userHmac: credentials.userHmac,
  host: credentials.serverURL,
})

const tokenPath = Platform.select({
  ios: "/channels/mobile_push/apns/tokens",
  android: "/channels/mobile_push/fcm/tokens"
})!


const apnsTokenPayload = async (token: string): any => {
  const installationId = await getIosPushNotificationServiceEnvironmentAsync() || 'development'
  return {
    apns: {
      device_token: token,
      installation_id: installationId
    }
  }
}

const fcmTokenPayload = (token: string): any => {
  return {
    fcm: {
      device_token: token
    }
  }
}


const unregisterTokenWithCredentials = async (token: string, credentials: Credentials) => {
  console.log('deleting token', token);
  const client = clientWithCredentials(credentials)
  client
    .request({
      method: 'DELETE',
      path: tokenPath + "/" + token
    })
    .catch(err => {
      console.log('delete token error', err);
    });
}


const registerTokenWithCredentials = async (token: string, credentials: Credentials) => {
  const data = Platform.OS === "ios" ?
    await apnsTokenPayload(token) :
    fcmTokenPayload(token)

  console.log('posting token', token);
  const client = clientWithCredentials(credentials)
  client
    .request({
      method: 'POST',
      path: tokenPath,
      data: data,
    })
    .catch(err => {
      console.log('post token error', err);
    });
}

export default function useDeviceToken(credentials: Credentials | null | undefined) {
  const [token, setToken] = React.useState<string | null>(null);
  const [credentialsUsedToRegister, setCredentialsUsedToRegister] = React.useState<Credentials | null>(null);

  useEffect(() => {
    requestPermissionsAsync().then(permissions => {
      console.log('permissions', permissions);
    })
    console.log("asking for token")
    getDevicePushTokenAsync().then((token: DevicePushToken) => {
      console.log("got token")
      if (token.type !== "web") {
        // no handling for web tokens in this demo
        setToken(token.data)
      }
    })
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