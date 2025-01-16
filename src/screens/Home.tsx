import React from 'react';

import { Button, SafeAreaView, ScrollView } from 'react-native';
import { styles } from '../constants';
import { useCredentials } from '../hooks/useAuth';
import { useNotifications } from '@magicbell/react-headless';
import Notification from '../components/Notification';
import usePushNotificationHandler from '../hooks/usePushNotificationHandler';

export default function HomeScreen(): React.JSX.Element {
  const [_, __, logout] = useCredentials();
  const store = useNotifications();

  usePushNotificationHandler();

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <ScrollView style={styles.scrollable}>
        {store?.notifications.map((notification) => (
          <Notification key={notification.id} data={notification} />
        ))}
      </ScrollView>
      <Button title="logout" onPress={logout} />
    </SafeAreaView>
  );
}
