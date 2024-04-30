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

const key = 'mb';

type Credentials = {
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
  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

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
    Promise.all([
      getCredentials(),
      new Promise(resolve => {
        setTimeout(resolve, MIN_LOADING_TIME);
      }),
    ]).then(([c]) => {
      setCredentials(c);
    });
  }, []);

  if (credentials) {
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
  const value = await AsyncStorage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    const {apiKey, userEmail, userHmac, serverURL} = JSON.parse(value);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MAGICBELL-API-KEY': apiKey,
        'X-MAGICBELL-USER-EMAIL': userEmail,
        // 'X-MAGICBELL-USER-HMAC': userHmac,
      },
    };

    const config = await fetch('https://magicbell-matt.loca.lt/config', options)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err));
    if (config) {
      return {apiKey, userEmail, userHmac, serverURL};
    }
  } catch (e) {
    console.error('Error parsing credentials', e);
    return null;
  }
  return null;
};

const storeCredentials = (value: Credentials) => {
  const jsonValue = JSON.stringify(value);
  return AsyncStorage.setItem(key, jsonValue);
};

const deleteCredentials = () => {
  return AsyncStorage.removeItem(key);
};
