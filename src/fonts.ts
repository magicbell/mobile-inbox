import { useFonts as useExpoFonts } from 'expo-font';
import { useEffect } from 'react';

/**
 * Loads embedded fonts and logs an error if it had problems doing so
 *
 * @returns true, when font loading is done or resulted in an error
 */
export function useFonts() {
  let [loaded, error] = useExpoFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('../assets/fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('../assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return loaded || error;
}
