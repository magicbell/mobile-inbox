import {useLinkingURL} from 'expo-linking';

import {Credentials} from './useAuth';
import {useMemo} from 'react';

function parseJwtToken(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

/**
 * Parses a launch URL and if is a review environment connection URL, uses the embedded credentials to sign in to the app.
 * 
 * ATTENTION: This is only for MagicBell internal use. You should not follow this example in your production app.
 *
 * Example URL:
 *  x-magicbell-review://connect?api-host=http://localhost:3000&project-jwt-token=abcdef.....abcdef
 */
const parseLaunchURLCredentials = (launchURL: URL): Credentials | null => {
  const apiHost = launchURL.searchParams.get('api-host');
  const projectJWTToken = launchURL.searchParams.get('project-jwt-token');
  if (!apiHost || !projectJWTToken) {
    console.warn(
      "Expected parameters [ 'api-host', 'project-jwt-token' ] but got:",
      Array.from(launchURL.searchParams.keys()),
    );
    return null;
  }

  const tokenData = parseJwtToken(projectJWTToken);
  const apiKey = tokenData['ProjectKey']['APIKey'];
  const credentials: Credentials = {
    apiKey: apiKey,
    userEmail: 'review@magicbell.io',
    userHmac: '',
    serverURL: apiHost,
  };
  console.log('Credentials from launch URL:', credentials);
  return credentials;
};

export default function useReviewCredentials(): Credentials | null {
  const launchURL = useLinkingURL();
  return useMemo(() => {
    if (!launchURL) {
      return null;
    }

    try {
      const url = new URL(launchURL);

      // ignore non review connect URLs
      if (url.protocol !== 'x-magicbell-review:' || url.host !== 'connect') {
        return null;
      }

      return parseLaunchURLCredentials(url);
    } catch (error) {
      console.warn('Could not parse launch URL: ', error);
      return null;
    }
  }, [launchURL]);
}
