import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { FlashcardsScreen } from './src/screens/FlashcardsScreen';
import { ConversationsScreen } from './src/screens/ConversationsScreen';
import { GrammarScreen } from './src/screens/GrammarScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AlphabetModal } from './src/components/AlphabetModal';
import { BottomPracticeBar } from './src/components/BottomPracticeBar';
import {
  getStoredStats,
  saveStats,
  completeLesson,
  toggleFavoriteCard,
  refillHearts,
  resetProgress,
  INITIAL_STATS,
} from './src/services/storage';
import { Lesson, Unit, UserStats } from './src/types';

type TabType = 'Home' | 'Flashcards' | 'Conversations' | 'Grammar' | 'Profile';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [activeLessonData, setActiveLessonData] = useState<{
    lesson: Lesson;
    unit: Unit;
  } | null>(null);
  const [showAlphabetModal, setShowAlphabetModal] = useState(false);

  // Load user progress
  useEffect(() => {
    const load = async () => {
      const stored = await getStoredStats();
      setStats(stored);
      setLoadingStats(false);
    };
    load();
  }, []);

  const handleSelectLesson = (lesson: Lesson, unit: Unit) => {
    setActiveLessonData({ lesson, unit });
  };

  const handleLessonComplete = async (
    earnedXp: number,
    correctAnswers: number,
    totalQuestions: number
  ) => {
    if (!activeLessonData) return;
    const updated = await completeLesson(activeLessonData.lesson.id, earnedXp);
    setStats(updated);
    setActiveLessonData(null);
  };

  const handleHeartLost = async () => {
    setStats((prev) => {
      const nextHearts = Math.max(0, prev.hearts - 1);
      const nextStats = { ...prev, hearts: nextHearts };
      saveStats(nextStats);
      return nextStats;
    });
  };

  const handleRefillHearts = async () => {
    const updated = await refillHearts();
    setStats(updated);
  };

  const handleToggleFavorite = async (cardId: string) => {
    const updated = await toggleFavoriteCard(cardId);
    setStats(updated);
  };

  const handleUpdateSpeechSpeed = async (speed: number) => {
    setStats((prev) => {
      const nextStats = { ...prev, speechSpeed: speed };
      saveStats(nextStats);
      return nextStats;
    });
  };

  const handleResetProgress = async () => {
    const fresh = await resetProgress();
    setStats(fresh);
    setActiveLessonData(null);
  };

  if (!fontsLoaded || loadingStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>جاري تحميل فرنسيتي...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Container */}
      <View style={styles.container}>
        {/* If user is inside a lesson, show full Lesson screen */}
        {activeLessonData ? (
          <LessonScreen
            lesson={activeLessonData.lesson}
            unit={activeLessonData.unit}
            stats={stats}
            onBack={() => setActiveLessonData(null)}
            onLessonComplete={handleLessonComplete}
            onHeartLost={handleHeartLost}
          />
        ) : (
          /* Normal Tab Screen Flow */
          <View style={styles.mainFlow}>
            {/* Header with Stats Badges */}
            <Header
              stats={stats}
              onRefillHearts={handleRefillHearts}
              onOpenAlphabet={() => setShowAlphabetModal(true)}
            />

            {/* Screen Content */}
            <View style={styles.screenContent}>
              {activeTab === 'Home' && (
                <HomeScreen
                  stats={stats}
                  onSelectLesson={handleSelectLesson}
                  onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                />
              )}

              {activeTab === 'Flashcards' && (
                <FlashcardsScreen
                  stats={stats}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {activeTab === 'Conversations' && <ConversationsScreen />}

              {activeTab === 'Grammar' && <GrammarScreen />}

              {activeTab === 'Profile' && (
                <ProfileScreen
                  stats={stats}
                  onUpdateSpeed={handleUpdateSpeechSpeed}
                  onRefillHearts={handleRefillHearts}
                  onResetProgress={handleResetProgress}
                />
              )}
            </View>

            {/* Quick Practice Bar at Bottom of Interface */}
            <BottomPracticeBar />

            {/* Bottom Tab Bar */}
            <View style={styles.bottomBar}>
              {/* Home */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setActiveTab('Home')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeTab === 'Home' ? 'school' : 'school-outline'}
                  size={22}
                  color={activeTab === 'Home' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'Home' && styles.tabButtonTextActive,
                  ]}
                >
                  الدروس
                </Text>
              </TouchableOpacity>

              {/* Flashcards */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setActiveTab('Flashcards')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeTab === 'Flashcards' ? 'albums' : 'albums-outline'}
                  size={22}
                  color={activeTab === 'Flashcards' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'Flashcards' && styles.tabButtonTextActive,
                  ]}
                >
                  البطاقات
                </Text>
              </TouchableOpacity>

              {/* Conversations */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setActiveTab('Conversations')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    activeTab === 'Conversations'
                      ? 'chatbubbles'
                      : 'chatbubbles-outline'
                  }
                  size={22}
                  color={activeTab === 'Conversations' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'Conversations' && styles.tabButtonTextActive,
                  ]}
                >
                  المحادثة
                </Text>
              </TouchableOpacity>

              {/* Grammar */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setActiveTab('Grammar')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeTab === 'Grammar' ? 'book' : 'book-outline'}
                  size={22}
                  color={activeTab === 'Grammar' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'Grammar' && styles.tabButtonTextActive,
                  ]}
                >
                  القواعد
                </Text>
              </TouchableOpacity>

              {/* Profile */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setActiveTab('Profile')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeTab === 'Profile' ? 'person' : 'person-outline'}
                  size={22}
                  color={activeTab === 'Profile' ? '#2563EB' : '#64748B'}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'Profile' && styles.tabButtonTextActive,
                  ]}
                >
                  حسابي
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom App Footer Signature */}
            <View style={styles.signatureFooter}>
              <Text style={styles.signatureText}>
                منصة مداد الذكي طريقك للتعلم بشغف. تم إنشاؤه من طرف الشيخاني محفوظ لبشير.
              </Text>
            </View>
          </View>
        )}

        {/* Global Alphabet Modal */}
        <AlphabetModal
          visible={showAlphabetModal}
          onClose={() => setShowAlphabetModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  mainFlow: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#2563EB',
  },
  signatureFooter: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
});
