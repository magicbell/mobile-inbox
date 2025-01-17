import { useCallback, useEffect, useState } from 'react';

import { Credentials } from './useAuth';
import { useURLMemo } from './useURLMemo';

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
    console.warn('Could not parse credentials from launch URL: ', url.toString());
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

export default function useReviewCredentials() {
  const deepLink = useURLMemo();
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  useEffect(() => {
    let url;
    try {
      url = deepLink ? new URL(deepLink) : null;
    } catch (error) {
      console.warn('Could not parse launch URL: ', error);
    }

    let parsedCredentials = null;
    if (url) {
      // ignore non review connect URLs
      if (url.protocol === 'x-magicbell-review:' && url.host === 'connect') {
        parsedCredentials = parseLaunchURLCredentials(url);
      }
    }
    setCredentials(parsedCredentials);
  }, [deepLink]);

  return credentials;
}
