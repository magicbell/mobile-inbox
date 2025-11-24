import React, { useEffect } from 'react';

import { Button, SafeAreaView, ScrollView, ActivityIndicator, Text } from 'react-native';
import { styles } from '../constants';
import { useCredentials } from '../hooks/useAuth';
import { useMagicBell } from '../components/MagicBellProvider';
import Notification from '../components/Notification';
import usePushNotificationHandler from '../hooks/usePushNotificationHandler';

export default function HomeScreen(): React.JSX.Element {
  const [_, __, logout] = useCredentials();
  const { notifications, isLoading, error, fetchNotifications } = useMagicBell();

  usePushNotificationHandler();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <ScrollView style={styles.scrollable}>
        {isLoading && <ActivityIndicator size="large" />}
        {error && <Text style={{ color: '#FFFFFF' }}>Error: {error.message}</Text>}
        {notifications?.map((notification) => (
          <Notification key={notification.id} data={notification} />
        ))}
      </ScrollView>
      <Button title="logout" onPress={logout} />
    </SafeAreaView>
  );
}
