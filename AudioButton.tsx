import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { speechService } from '../services/speech';

interface AudioButtonProps {
  text: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  isSlow?: boolean;
  style?: object;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 24,
  color = '#2563EB',
  backgroundColor = 'transparent',
  isSlow = false,
  style,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      await speechService.speak(text, isSlow ? 0.65 : 0.9);
      // Automatically reset isPlaying after duration
      const durationEstimate = Math.max(1200, text.length * 90);
      setTimeout(() => {
        setIsPlaying(false);
      }, durationEstimate);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: (size * 1.8) / 2,
          backgroundColor: backgroundColor || '#EFF6FF',
        },
        isPlaying && styles.buttonActive,
        style,
      ]}
      accessibilityLabel="استمع إلى النطق الفرنسي"
    >
      {isPlaying ? (
        <Ionicons name="volume-high" size={size} color={color} />
      ) : (
        <Ionicons name={isSlow ? 'speedometer-outline' : 'volume-medium'} size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonActive: {
    transform: [{ scale: 1.08 }],
    backgroundColor: '#DBEAFE',
  },
});
