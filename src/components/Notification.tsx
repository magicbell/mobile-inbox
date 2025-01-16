import { IRemoteNotification } from '@magicbell/react-headless';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigationRef } from '../Navigator';
import { CommonActions } from '@react-navigation/native';
import { colors, routes } from '../constants';

interface IProps {
  data: IRemoteNotification;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    minHeight: 60,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.bg.active,
  },
  title: {
    color: colors.text.default,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  content: {
    color: colors.text.muted,
  },
  timestamp: {
    color: colors.text.muted,
    fontWeight: '100',
    fontSize: 12,
  },
});

export function convertTimestamp(sentAt: Date) {
  const now = new Date();
  const diff = now.getTime() - sentAt.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  let sentAtString = '';

  if (years > 0) {
    sentAtString = `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    sentAtString = `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    sentAtString = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    sentAtString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    sentAtString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (seconds > 0) {
    sentAtString = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  return sentAtString;
}

export default function Notification(props: IProps) {
  const handlePress = (data: any = {}) => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.navigate(routes.details, data));
    }
  };

  // convert sentAt timestamp to a human-readable format such as "2 hours ago"
  const sentAt = new Date(+props.data.sentAt! * 1000);
  const sentAtString = convertTimestamp(sentAt);

  return (
    <TouchableOpacity onPress={() => handlePress(props.data)} style={styles.container}>
      <Text style={styles.title}>{props.data.title}</Text>
      <View style={styles.body}>
        <Text style={styles.timestamp}>{sentAtString}</Text>
        <Text style={styles.content}>{props.data.content || 'No content'}</Text>
      </View>
    </TouchableOpacity>
  );
}
