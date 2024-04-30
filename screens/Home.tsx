import React from 'react';

import {Button, SafeAreaView, ScrollView, Text} from 'react-native';
import {styles} from '../constants';
import {useCredentials} from '../hooks/useAuth';
import {useNotifications} from '@magicbell/react-headless';
import useDeviceToken from '../hooks/useDeviceToken';
import Notification from '../components/Notification';

export default function HomeScreen(): React.JSX.Element {
  const [_, __, logout] = useCredentials();
  const store = useNotifications();
  const token = useDeviceToken();

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <ScrollView style={styles.scrollable}>
        {store?.notifications.map(notification => (
          <Notification key={notification.id} data={notification} />
        ))}
      </ScrollView>
      <Text>Device token: {token}</Text>
      <Button title="logout" onPress={logout} />
    </SafeAreaView>
  );
}
