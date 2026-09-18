import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DIALOGUES } from '../data/dialogues';
import { Dialogue, DialogueLine } from '../types';
import { AudioButton } from '../components/AudioButton';
import { speechService } from '../services/speech';

export const ConversationsScreen: React.FC = () => {
  const [selectedDialogue, setSelectedDialogue] = useState<Dialogue | null>(null);
  const [showArabic, setShowArabic] = useState(true);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isSlowMode, setIsSlowMode] = useState(false);

  const handlePlayLine = async (line: DialogueLine) => {
    setActiveLineId(line.id);
    await speechService.speak(line.french, isSlowMode ? 0.65 : 0.88);
    const duration = Math.max(1200, line.french.length * 85);
    setTimeout(() => {
      setActiveLineId(null);
    }, duration);
  };

  const handlePlayFullConversation = async (dialogue: Dialogue) => {
    for (const line of dialogue.lines) {
      setActiveLineId(line.id);
      await speechService.speak(line.french, isSlowMode ? 0.7 : 0.9);
      // Wait estimate
      await new Promise((res) => setTimeout(res, Math.max(1600, line.french.length * 90)));
    }
    setActiveLineId(null);
  };

  return (
    <View style={styles.container}>
      {!selectedDialogue ? (
        /* Dialogue List View */
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollListContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Banner */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconBox}>
              <Ionicons name="chatbubbles" size={28} color="#2563EB" />
            </View>
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerTitle}>محادثات واقعية في باريس</Text>
              <Text style={styles.bannerSubtitle}>
                استمع إلى حوارات الحياة اليومية وتدرّب على النطق والردود الطبيعية
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>اختر محادثة لبدء الاستماع والتدريب:</Text>

          {DIALOGUES.map((diag, idx) => (
            <TouchableOpacity
              key={diag.id}
              style={styles.dialogueCard}
              onPress={() => setSelectedDialogue(diag)}
              activeOpacity={0.8}
            >
              <View style={styles.dialogueTopRow}>
                <View style={styles.dialogueIndexBadge}>
                  <Text style={styles.dialogueIndexText}>0{idx + 1}</Text>
                </View>
                <View style={styles.dialogueLevelTag}>
                  <Text style={styles.dialogueLevelText}>{diag.level}</Text>
                </View>
              </View>

              <Text style={styles.dialogueTitle}>{diag.title}</Text>
              <Text style={styles.dialogueTitleFr}>{diag.titleFr}</Text>
              <Text style={styles.dialogueDesc}>{diag.description}</Text>

              <View style={styles.dialogueFooter}>
                <View style={styles.dialogueScene}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.dialogueSceneText}>{diag.scene}</Text>
                </View>
                <View style={styles.dialogueStartBtn}>
                  <Text style={styles.dialogueStartText}>ابدأ الحوار</Text>
                  <Ionicons name="play" size={12} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Individual Interactive Dialogue Simulator */
        <View style={styles.chatContainer}>
          {/* Top Bar */}
          <View style={styles.chatTopBar}>
            <TouchableOpacity
              style={styles.chatBackBtn}
              onPress={() => {
                speechService.stop();
                setSelectedDialogue(null);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.chatHeaderCenter}>
              <Text style={styles.chatHeaderTitle}>{selectedDialogue.title}</Text>
              <Text style={styles.chatHeaderSub}>{selectedDialogue.scene}</Text>
            </View>

            <TouchableOpacity
              style={styles.playAllBtn}
              onPress={() => handlePlayFullConversation(selectedDialogue)}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={18} color="#FFFFFF" />
              <Text style={styles.playAllText}>تشغيل الكل</Text>
            </TouchableOpacity>
          </View>

          {/* Controls Bar (Show Arabic toggle & Slow audio toggle) */}
          <View style={styles.controlsBar}>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>إظهار الترجمة العربية:</Text>
              <Switch
                value={showArabic}
                onValueChange={setShowArabic}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={showArabic ? '#2563EB' : '#F1F5F9'}
              />
            </View>

            <TouchableOpacity
              style={[styles.speedToggleBtn, isSlowMode && styles.speedToggleBtnActive]}
              onPress={() => setIsSlowMode(!isSlowMode)}
              activeOpacity={0.7}
            >
              <Text style={[styles.speedToggleText, isSlowMode && styles.speedToggleTextActive]}>
                {isSlowMode ? '🐢 نطق بطيء مفعّل' : '🐇 نطق طبيعي'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dialogue Messages Scroll */}
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedDialogue.lines.map((line) => {
              const isSpeakingThis = activeLineId === line.id;
              const isLeft = line.side === 'left';

              return (
                <View
                  key={line.id}
                  style={[
                    styles.messageRow,
                    isLeft ? styles.messageRowLeft : styles.messageRowRight,
                  ]}
                >
                  {/* Speaker Avatar */}
                  <View
                    style={[
                      styles.avatarCircle,
                      isLeft ? styles.avatarLeft : styles.avatarRight,
                    ]}
                  >
                    <Ionicons
                      name={line.avatar as any}
                      size={18}
                      color={isLeft ? '#2563EB' : '#059669'}
                    />
                  </View>

                  {/* Speech Bubble */}
                  <TouchableOpacity
                    style={[
                      styles.speechBubble,
                      isLeft ? styles.bubbleLeft : styles.bubbleRight,
                      isSpeakingThis && styles.bubbleSpeaking,
                    ]}
                    onPress={() => handlePlayLine(line)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.speakerRow}>
                      <Text style={styles.speakerName}>{line.speaker}</Text>
                      <Ionicons
                        name={isSpeakingThis ? 'volume-high' : 'volume-medium-outline'}
                        size={16}
                        color={isSpeakingThis ? '#2563EB' : '#94A3B8'}
                      />
                    </View>

                    <Text style={styles.bubbleFrench}>{line.french}</Text>

                    {showArabic && (
                      <View style={styles.bubbleArabicWrap}>
                        <Text style={styles.bubblePhonetics}>[{line.phonetics}]</Text>
                        <Text style={styles.bubbleArabic}>{line.arabic}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Key Vocabulary Sheet */}
            <View style={styles.vocabSheet}>
              <View style={styles.vocabSheetHeader}>
                <Ionicons name="sparkles" size={16} color="#D97706" />
                <Text style={styles.vocabSheetTitle}>أهم مفردات هذا الحوار:</Text>
              </View>

              <View style={styles.vocabSheetGrid}>
                {selectedDialogue.keyVocab.map((kv, i) => (
                  <View key={i} style={styles.vocabSheetItem}>
                    <View style={styles.vocabSheetLeft}>
                      <Text style={styles.vocabSheetFr}>{kv.french}</Text>
                      <Text style={styles.vocabSheetPho}>[{kv.phonetics}]</Text>
                      <Text style={styles.vocabSheetAr}>{kv.arabic}</Text>
                    </View>
                    <AudioButton text={kv.french} size={18} color="#2563EB" />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollList: {
    flex: 1,
  },
  scrollListContent: {
    padding: 16,
    paddingBottom: 30,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
    gap: 14,
  },
  bannerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    textAlign: 'right',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 18,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textAlign: 'right',
  },
  dialogueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dialogueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dialogueIndexBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dialogueIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  dialogueLevelTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dialogueLevelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  dialogueTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  dialogueTitleFr: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
  dialogueDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'right',
    lineHeight: 18,
  },
  dialogueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dialogueScene: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dialogueSceneText: {
    fontSize: 12,
    color: '#64748B',
  },
  dialogueStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dialogueStartText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  chatContainer: {
    flex: 1,
  },
  chatTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chatBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  chatHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  chatHeaderSub: {
    fontSize: 11,
    color: '#64748B',
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  playAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  speedToggleBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  speedToggleBtnActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  speedToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  speedToggleTextActive: {
    color: '#92400E',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarLeft: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  avatarRight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  speechBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleRight: {
    backgroundColor: '#F0FDF4',
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  bubbleSpeaking: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  speakerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  bubbleFrench: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  bubbleArabicWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bubblePhonetics: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    textAlign: 'right',
  },
  bubbleArabic: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
    textAlign: 'right',
  },
  vocabSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vocabSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  vocabSheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  vocabSheetGrid: {
    gap: 10,
  },
  vocabSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  vocabSheetLeft: {
    flex: 1,
  },
  vocabSheetFr: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  vocabSheetPho: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  vocabSheetAr: {
    fontSize: 13,
    color: '#475569',
    marginTop: 1,
  },
});
