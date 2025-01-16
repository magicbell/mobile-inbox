import { useLinkingURL } from 'expo-linking';

import { Credentials } from './useAuth';
import { useMemo } from 'react';

/**
 * Parses a launch URL and if is a review environment connection URL, uses the embedded credentials to sign in to the app.
 *
 * ATTENTION: This is only for MagicBell internal use. You should not follow this example in your production app.
 *
 * Example URL:
 *   x-magicbell-review://connect?apiHost=[...]&apiKey=[...]&userEmail=[...]&userHmac=[...]
 * 
 */
const parseLaunchURLCredentials = (url: URL): Credentials | null => {
  const serverURL = url.searchParams.get('apiHost');
  const apiKey = url.searchParams.get('apiKey');

  // TODO: support userExternalID as well
  const userEmail = url.searchParams.get('userEmail');

  const userHmac = url.searchParams.get('userHmac');

  if (!serverURL || !apiKey || !userEmail || !userHmac) {
    console.warn('Could not parse credentials from launch URL: ', url);
    return null;
  }
  const credentials: Credentials = {
    serverURL,
    apiKey,
    userHmac,
    userEmail,
  };
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
