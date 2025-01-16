import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MagicBellProvider} from '@magicbell/react-headless';

import {MIN_LOADING_TIME} from '../screens/Splash';
import {UserClient} from 'magicbell/user-client';
import useDeviceToken from './useDeviceToken';
import useReviewCredentials from './useReviewCredentials';

const storageKey = 'mb';

export type Credentials = {
  apiKey: string;
  userEmail: string;
  userHmac: string;
  serverURL: string;
};

type CredentialsContextType = {
  credentials: Credentials | null | undefined;
  signIn: (c: Credentials) => void;
  signOut: () => void;
};

const CredentialsContext = createContext<CredentialsContextType | null>(null);

export const useCredentials = () => {
  const context = useContext(CredentialsContext);
  if (!context) {
    throw new Error('useCredentials must be used within a CredentialsProvider');
  }
  return [context.credentials, context.signIn, context.signOut] as const;
};

export default function CredentialsProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const reviewCredentials = useReviewCredentials()
  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

  useDeviceToken(credentials);

  const signIn = useCallback(async (c: Credentials) => {
    storeCredentials(c);
    const validCredentials = await getCredentials();
    if (validCredentials) {
      setCredentials(validCredentials);
    } else {
      await deleteCredentials();
      setCredentials(null);
    }
  }, []);
  const signOut = useCallback(async () => {
    await deleteCredentials();
    setCredentials(null);
  }, []);

  useEffect(() => {
    if (reviewCredentials) {
      storeCredentials(reviewCredentials).then(() => {
        setCredentials(reviewCredentials);
      });
      return;
    }

    Promise.all([
      getCredentials(),
      new Promise(resolve => {
        setTimeout(resolve, MIN_LOADING_TIME);
      }),
    ]).then(([c]) => {
      setCredentials(c);
    });
  }, [reviewCredentials]);

  if (credentials) {
    console.log('credentials', JSON.stringify(credentials));
    return (
      <MagicBellProvider
        apiKey={credentials.apiKey}
        userEmail={credentials.userEmail}
        userKey={credentials.userHmac}
        serverURL={credentials.serverURL}>
        <CredentialsContext.Provider value={{credentials, signIn, signOut}}>
          {children}
        </CredentialsContext.Provider>
      </MagicBellProvider>
    );
  }

  return (
    <CredentialsContext.Provider value={{credentials, signIn, signOut}}>
      {children}
    </CredentialsContext.Provider>
  );
}

const getCredentials = async () => {
  const value = await AsyncStorage.getItem(storageKey);
  if (!value) {
    return null;
  }
  try {
    const {apiKey, userEmail, userHmac, serverURL} = JSON.parse(value);
    const client = new UserClient({
      apiKey: apiKey,
      userEmail: userEmail,
      userHmac: userHmac,
      host: serverURL,
    });
    const config = await client.request({
      method: 'GET',
      path: '/config',
    });
    if (config) {
      return {apiKey, userEmail, userHmac, serverURL};
    }
  } catch (e) {
    console.error('Error parsing credentials', e);
    await deleteCredentials();
    return null;
  }
  return null;
};

const storeCredentials = async (value: Credentials) => {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(storageKey, jsonValue);
};

const deleteCredentials = async () => {
  await AsyncStorage.removeItem(storageKey);
};
