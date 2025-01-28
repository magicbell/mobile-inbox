import React, { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import CredentialsProvider from './hooks/useAuth';
import URLMemoProvider from './hooks/useURLMemo';
import Navigator from './Navigator';
import { useFonts } from './fonts';

SplashScreen.preventAutoHideAsync().catch(console.warn);
SplashScreen.setOptions({
  fade: true,
});

function App() {
  let loadedFonts = useFonts();
  useEffect(() => {
    if (loadedFonts) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null;
  }

  return (
    <URLMemoProvider>
      <CredentialsProvider>
        <Navigator />
      </CredentialsProvider>
    </URLMemoProvider>
  );
}

export default App;
