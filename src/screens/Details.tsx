import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, styles } from '../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { convertTimestamp } from '../components/Notification';
import { IRemoteNotification } from '@magicbell/react-headless';

const s = StyleSheet.create({
  sectionContainer: {
    ...styles.sectionContainer,
    justifyContent: 'flex-start',
    padding: 16,
  },
  header: {
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginBottom: 16,
    // backgroundColor: colors.bg.active,
  },
  title: {
    fontSize: 32,
    color: colors.text.default,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    color: colors.text.muted,
    fontSize: 16,
  },
  timestamp: {
    color: colors.text.highlight,
    fontWeight: '100',
    fontSize: 12,
  },
});

export default function Details(props: NativeStackScreenProps<any>) {
  console.log('props', props.route.params);
  const params = props.route.params as IRemoteNotification;
  const sentAtString = convertTimestamp(new Date(params!.sentAt * 1000));
  return (
    <View style={s.sectionContainer}>
      <View style={s.header}>
        <Text style={s.title}>{params!.title}</Text>
        <View style={s.body}>
          <Text style={s.timestamp}>{sentAtString}</Text>
        </View>
      </View>
      <Text style={s.content}>{params!.content || 'No content'}</Text>
      {/* <Text style={s.content}>{params.category}</Text> */}
    </View>
  );
}
