import React, { useEffect, useState } from 'react';
import { ButtonProps, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  interpolate,
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.bg.primary,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 25,
    margin: 20,
    width: 'auto',
    alignItems: 'center',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  loading: {
    position: 'absolute',
  },
});

function Spinner() {
  const r = 10;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedValue = useSharedValue(0);
  const timingAnimatedValue = useDerivedValue(() =>
    withRepeat(
      withTiming(animatedValue.value, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    ),
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(timingAnimatedValue.value, [0, 100], [2 * Math.PI * r, 0]),
  }));
  useEffect(() => {
    animatedValue.value = 100;
  }, [animatedValue]);
  return (
    <Animated.View style={styles.loading}>
      <Svg
        viewBox="0 0 50 50"
        width="38"
        height="38"
        fill="none"
        stroke="#fff"
        strokeWidth={5}
        strokeDasharray={2 * Math.PI * r}
      >
        <AnimatedCircle cx="25" cy="25" r={r} animatedProps={animatedProps} />
      </Svg>
    </Animated.View>
  );
}

export default function Button(props: ButtonProps & { loading: boolean }) {
  return (
    <TouchableOpacity
      {...props}
      style={{ ...styles.button, ...(props.loading ? styles.disabled : {}) }}
      disabled={props.loading}
    >
      {props.loading ? <Spinner /> : <Text style={styles.text}>{props.title}</Text>}
    </TouchableOpacity>
  );
}
