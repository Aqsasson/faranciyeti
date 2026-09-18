import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FRENCH_ALPHABET } from '../data/alphabet';
import { AlphabetLetter } from '../types';
import { speechService } from '../services/speech';

interface AlphabetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AlphabetModal: React.FC<AlphabetModalProps> = ({ visible, onClose }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter>(FRENCH_ALPHABET[0]);

  const handlePlayLetter = (letter: AlphabetLetter) => {
    setSelectedLetter(letter);
    speechService.speak(letter.letter, 0.8);
  };

  const handlePlayWord = (word: string) => {
    speechService.speak(word, 0.85);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>الأبجدية الفرنسية والنطق</Text>
            <Text style={styles.subtitle}>L'Alphabet Français (26 Lettres)</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Selected Letter Detail Card */}
        <View style={styles.activeCard}>
          <View style={styles.activeTop}>
            <View style={styles.bigLetterBox}>
              <Text style={styles.bigLetter}>{selectedLetter.letter}</Text>
              <Text style={styles.lowerLetter}>{selectedLetter.letter.toLowerCase()}</Text>
            </View>

            <View style={styles.letterInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>الاسم بالفرنسية:</Text>
                <Text style={styles.frenchName}>{selectedLetter.frenchName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>النطق الصوتي بالعربي:</Text>
                <Text style={styles.arabicName}>"{selectedLetter.arabicName}"</Text>
              </View>
              <View style={styles.soundTipBox}>
                <Ionicons name="information-circle" size={16} color="#2563EB" />
                <Text style={styles.soundTip}>{selectedLetter.phoneticSound}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.speakerBig}
              onPress={() => handlePlayLetter(selectedLetter)}
              activeOpacity={0.7}
            >
              <Ionicons name="volume-high" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Example Word */}
          <View style={styles.exampleBox}>
            <View style={styles.exampleTextCol}>
              <Text style={styles.exampleLabel}>مثال من الكلمات اليومية:</Text>
              <View style={styles.exampleWordRow}>
                <Text style={styles.exampleWordFr}>{selectedLetter.exampleWordFr}</Text>
                <Text style={styles.exampleWordPhonetic}>({selectedLetter.examplePhonetic})</Text>
                <Text style={styles.exampleWordAr}>= {selectedLetter.exampleWordAr}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.exampleAudioBtn}
              onPress={() => handlePlayWord(selectedLetter.exampleWordFr)}
            >
              <Ionicons name="volume-medium" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 26 Letters Grid */}
        <Text style={styles.gridSectionTitle}>اضغط على أي حرف للاستماع والشرح:</Text>
        <FlatList
          data={FRENCH_ALPHABET}
          keyExtractor={(item) => item.letter}
          numColumns={4}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const isSelected = item.letter === selectedLetter.letter;
            return (
              <TouchableOpacity
                style={[styles.letterTile, isSelected && styles.letterTileActive]}
                onPress={() => handlePlayLetter(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tileLetter, isSelected && styles.tileLetterActive]}>
                  {item.letter}
                </Text>
                <Text style={[styles.tileArabic, isSelected && styles.tileArabicActive]}>
                  {item.arabicName}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  activeCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bigLetterBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigLetter: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  lowerLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#93C5FD',
  },
  letterInfo: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  frenchName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  arabicName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  soundTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
    gap: 5,
  },
  soundTip: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  speakerBig: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exampleTextCol: {
    flex: 1,
  },
  exampleLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  exampleWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  exampleWordFr: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  exampleWordPhonetic: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  exampleWordAr: {
    fontSize: 13,
    color: '#475569',
  },
  exampleAudioBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    paddingHorizontal: 16,
    marginBottom: 10,
    textAlign: 'right',
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  letterTile: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  letterTileActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
    transform: [{ scale: 1.05 }],
  },
  tileLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  tileLetterActive: {
    color: '#FFFFFF',
  },
  tileArabic: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tileArabicActive: {
    color: '#BFDBFE',
  },
});
