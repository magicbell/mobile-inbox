import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {styles} from '../constants';

export default function KeyboardAvoidingContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.sectionContainer}>
      <KeyboardAvoidingView
        style={styles.sectionContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sectionContainer}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
