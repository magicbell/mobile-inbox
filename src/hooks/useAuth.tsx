import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';

import { Client } from 'magicbell-js/project-client';
import useDeviceToken from './useDeviceToken';

const storageKey = 'mb';

export type Credentials = {
  apiKey: string;
  secretKey: string;
  userEmail: string;
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

export default function CredentialsProvider({ children }: { children: React.ReactElement }) {
  const [credentials, setCredentials] = useState<Credentials | null | undefined>(undefined);

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
    getCredentials().then((c) => {
      setCredentials(c);
    });
  }, []);

  return <CredentialsContext.Provider value={{ credentials, signIn, signOut }}>{children}</CredentialsContext.Provider>;
}

const getCredentials = async () => {
  const value = await AsyncStorage.getItem(storageKey);
  if (!value) {
    return null;
  }
  try {
    const { apiKey, userEmail, secretKey, serverURL } = JSON.parse(value);

    const payload = {
      user_email: userEmail,
      user_external_id: null,
      api_key: apiKey,
    };

    const token = await createJWT(payload, secretKey);

    const client = new Client({
      token,
    });

    if (client.config) {
      return { apiKey, userEmail, secretKey, serverURL };
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

// Helper function to convert string to base64url encoding
const base64UrlEncode = (str: string): string => {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Create JWT using expo-crypto for HMAC signing
const createJWT = async (payload: object, secret: string): Promise<string> => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 86400, // 1 day
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const message = `${encodedHeader}.${encodedPayload}`;

  // Create HMAC signature using expo-crypto
  const signature = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, secret + message);

  // Convert hex signature to base64url
  const signatureBytes = signature.match(/.{2}/g)?.map((byte: string) => parseInt(byte, 16)) || [];
  const signatureStr = String.fromCharCode(...signatureBytes);
  const encodedSignature = base64UrlEncode(signatureStr);

  return `${message}.${encodedSignature}`;
};
