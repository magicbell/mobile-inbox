import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function TokenBox({ token }: { token: string | null }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!token) return;
    await Clipboard.setStringAsync(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokenText} numberOfLines={1} ellipsizeMode="middle">
        Token: <Text selectable>{token}</Text>
      </Text>
      <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
        <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23283B',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  tokenText: {
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: '#2A314D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  copyText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
