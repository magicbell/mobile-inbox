import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Client } from 'magicbell-js/user-client';
import useDeviceToken from './useDeviceToken';

const storageKey = 'mb';

export type Credentials = {
  serverURL: string;
  userJWT: string;
};

type CredentialsContextType = {
  credentials: Credentials | null | undefined;
  signIn: (c: Credentials) => void;
  signOut: () => void;
  token: string | null;
};

const CredentialsContext = createContext<CredentialsContextType | null>(null);

export const useCredentials = () => {
  const context = useContext(CredentialsContext);
  if (!context) {
    throw new Error('useCredentials must be used within a CredentialsProvider');
  }
  return [context.credentials, context.signIn, context.signOut, context.token] as const;
};

export default function CredentialsProvider({ children }: { children: React.ReactElement }) {
  const [credentials, setCredentials] = useState<Credentials | null | undefined>(undefined);

  const token = useDeviceToken(credentials);

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
    getCredentials().then((c) => {
      setCredentials(c);
    });
  }, []);

  return (
    <CredentialsContext.Provider value={{ credentials, signIn, signOut, token }}>
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
    const { serverURL, userJWT } = JSON.parse(value);

    const client = new Client({
      token: userJWT,
      baseUrl: serverURL,
    });

    // TODO: Verify bad credentials cannot be used
    // Use the client to check the credentials are valid
    if (client.config) {
      return { serverURL, userJWT };
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
