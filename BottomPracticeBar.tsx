import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { speechService } from '../services/speech';

interface QuickPhrase {
  french: string;
  arabic: string;
  phonetics: string;
}

const QUICK_PHRASES: QuickPhrase[] = [
  { french: 'Bonne chance !', arabic: 'حظاً موفقاً!', phonetics: 'بون شانس !' },
  { french: 'Avec plaisir !', arabic: 'بكل سرور!', phonetics: 'أفيك بليزير !' },
  { french: 'Je vous en prie', arabic: 'على الرحب والسعة / عفواً', phonetics: 'جو فوزان بري' },
  { french: 'Tout va bien !', arabic: 'كل شيء على ما يرام!', phonetics: 'تو فا بيان !' },
  { french: 'À tout à l’heure', arabic: 'أراك بعد قليل', phonetics: 'آ تو تالور' },
  { french: 'C’est parfait !', arabic: 'هذا ممتاز ومثالي!', phonetics: 'سيه بارفيه !' },
  { french: 'Pas de problème', arabic: 'لا توجد أي مشكلة', phonetics: 'با دو بروبليم' },
  { french: 'Bon voyage !', arabic: 'رحلة سعيدة!', phonetics: 'بون فواياج !' },
  { french: 'Prenez soin de vous', arabic: 'اعتنِ بنفسك جيداً', phonetics: 'برونيه سوان دو فو' },
  { french: 'À la prochaine !', arabic: 'إلى المرة القادمة!', phonetics: 'آ لا بروشين !' },
];

export const BottomPracticeBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const phrase = QUICK_PHRASES[currentIndex];

  const handleNextPhrase = () => {
    setCurrentIndex((prev) => (prev + 1) % QUICK_PHRASES.length);
  };

  const handlePlay = async (slowSpeed: boolean = false) => {
    setIsPlaying(true);
    await speechService.speak(phrase.french, slowSpeed ? 0.65 : 0.9);
    setTimeout(() => {
      setIsPlaying(false);
    }, Math.max(1000, phrase.french.length * 80));
  };

  if (isCollapsed) {
    return (
      <TouchableOpacity
        style={styles.collapsedBar}
        onPress={() => setIsCollapsed(false)}
        activeOpacity={0.8}
      >
        <Ionicons name="volume-medium" size={16} color="#2563EB" />
        <Text style={styles.collapsedText}>
          تمرن صوتي سريع أسفل الواجهة: <Text style={styles.collapsedHighlight}>{phrase.french}</Text>
        </Text>
        <Ionicons name="chevron-up" size={16} color="#2563EB" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top micro header */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.badgeTitle}>تدريب نطق سريع أسفل الشاشة</Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={handleNextPhrase}
            accessibilityLabel="العبارة التالية"
          >
            <Ionicons name="shuffle" size={16} color="#475569" />
            <Text style={styles.actionIconText}>عبارة أخرى</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.collapseBtn}
            onPress={() => setIsCollapsed(true)}
            accessibilityLabel="تصغير الشريط"
          >
            <Ionicons name="chevron-down" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main phrase content */}
      <View style={styles.phraseRow}>
        <View style={styles.phraseTextCol}>
          <Text style={styles.frenchText}>{phrase.french}</Text>
          <View style={styles.subInfoRow}>
            <Text style={styles.phoneticText}>[{phrase.phonetics}]</Text>
            <Text style={styles.arabicText}>= {phrase.arabic}</Text>
          </View>
        </View>

        {/* Action audio buttons */}
        <View style={styles.audioButtonsCol}>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={() => handlePlay(false)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? 'volume-high' : 'volume-medium'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.playButtonText}>استمع</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.slowButton}
            onPress={() => handlePlay(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.slowButtonText}>🐢 بطيء</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  collapsedText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  collapsedHighlight: {
    fontWeight: '900',
    color: '#1D4ED8',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  actionIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  collapseBtn: {
    padding: 2,
  },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  phraseTextCol: {
    flex: 1,
  },
  frenchText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  phoneticText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  arabicText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  audioButtonsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  playButtonActive: {
    backgroundColor: '#1D4ED8',
  },
  playButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  slowButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slowButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
});
