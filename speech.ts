import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

class SpeechService {
  private currentSpeakingText: string | null = null;
  private isCurrentlySpeaking: boolean = false;

  async speak(text: string, speed: number = 0.9): Promise<void> {
    if (!text || text.trim() === '') return;
    const cleanText = text.trim();

    try {
      this.stop();
      this.currentSpeakingText = cleanText;
      this.isCurrentlySpeaking = true;

      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Direct Web Speech API gives highest reliability in browser
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.rate = Math.max(0.6, Math.min(1.2, speed));
        utterance.pitch = 1.0;

        utterance.onend = () => {
          this.isCurrentlySpeaking = false;
          this.currentSpeakingText = null;
        };

        utterance.onerror = () => {
          this.isCurrentlySpeaking = false;
          this.currentSpeakingText = null;
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Native Expo Speech for iOS & Android
        await Speech.speak(cleanText, {
          language: 'fr-FR',
          pitch: 1.0,
          rate: Math.max(0.6, Math.min(1.2, speed)),
          onDone: () => {
            this.isCurrentlySpeaking = false;
            this.currentSpeakingText = null;
          },
          onError: () => {
            this.isCurrentlySpeaking = false;
            this.currentSpeakingText = null;
          },
        });
      }
    } catch (error) {
      console.warn('Speech error:', error);
      this.isCurrentlySpeaking = false;
      this.currentSpeakingText = null;
    }
  }

  stop(): void {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    } catch {
      // ignore
    }
    this.isCurrentlySpeaking = false;
    this.currentSpeakingText = null;
  }

  isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  getCurrentText(): string | null {
    return this.currentSpeakingText;
  }
}

export const speechService = new SpeechService();
