import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Gloss({ tone = 'green', style }) {
  const colors =
    tone === 'light'
      ? [
          'rgba(255,255,255,0.60)',
          'rgba(255,255,255,0.15)',
          'rgba(255,255,255,0)',
        ]
      : [
          'rgba(255,255,255,0.30)',
          'rgba(255,255,255,0.08)',
          'rgba(255,255,255,0)',
        ];

  return (
    <LinearGradient
      colors={colors}
      locations={[0, 0.4, 0.7]}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, style]}
    />
  );
}
