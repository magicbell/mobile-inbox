import React, {useState, useEffect} from 'react';
import {MagicBellProvider} from '@magicbell/react-headless';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const apiKey = 'd6a3cf19179a45a5daa9ac7f3f37e9d49914d2ad';
const userEmail = 'matt@magicbell.io';
const userKey = '5n4ooUtzydnYq5GYh6PIWGeP2alepTf/Qgb/Sp/g3Co=';
const baseURL = 'http://localhost:3000';

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function MBFetch(url: string, method: string, body: any) {
  if (method === 'GET') {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-MAGICBELL-API-KEY': apiKey,
        'X-MAGICBELL-USER-EMAIL': userEmail,
        'X-MAGICBELL-USER-HMAC': userKey,
      },
    });
  } else {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-MAGICBELL-API-KEY': apiKey,
        'X-MAGICBELL-USER-EMAIL': userEmail,
        'X-MAGICBELL-USER-HMAC': userKey,
      },
      body: JSON.stringify(body),
    });
  }
}

function App(): React.JSX.Element {
  const [token, setToken] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    PushNotificationIOS.requestPermissions().then((result: any) => {
      console.log('request permissions: ', result);
    });
    PushNotificationIOS.addEventListener('register', (t: string) => {
      console.log('token?', t);
      setToken(t);
    });
  }, []);

  useEffect(() => {
    MBFetch(`${baseURL}/notifications`, 'POST', {});
  }, []);

  return (
    <MagicBellProvider apiKey={apiKey} userEmail={userEmail} userKey={userKey}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title={`Device tokens?: ${token}`} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </MagicBellProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  notificationContent: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'pink',
  },
  notificationBody: {
    color: 'white',
  },
});

export default App;
