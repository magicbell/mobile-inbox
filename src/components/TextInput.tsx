import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '../constants';

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bg.default,
    paddingHorizontal: 7,
    marginHorizontal: 20,
    marginVertical: 6,
    width: 'auto',
    alignItems: 'center',
    borderRadius: 4,
    height: 40,
    color: '#fff',
  },
});

export default function CustomTextInput(props: TextInputProps) {
  return <TextInput {...props} style={styles.input} />;
}
