import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../types';

const STORAGE_KEY = '@french_learning_user_stats_v1';

export const INITIAL_STATS: UserStats = {
  xp: 120,
  streak: 3,
  hearts: 5,
  maxHearts: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['u1_l1'], // First lesson completed by default for friendly start
  favoriteCards: ['fc_1', 'fc_4', 'fc_10'],
  achievements: ['first_step', 'curious_learner'],
  speechSpeed: 0.9,
  autoAudio: true,
};

export const getStoredStats = async (): Promise<UserStats> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATS));
      return INITIAL_STATS;
    }
    const parsed = JSON.parse(raw);
    // Check daily streak
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const last = new Date(parsed.lastActiveDate);
      const current = new Date(today);
      const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        // Continued streak
        parsed.streak += 1;
      } else if (diffDays > 1) {
        // Reset streak
        parsed.streak = 1;
      }
      parsed.lastActiveDate = today;
      // Refill hearts each new day
      parsed.hearts = parsed.maxHearts || 5;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return { ...INITIAL_STATS, ...parsed };
  } catch (e) {
    console.error('Failed to load stats', e);
    return INITIAL_STATS;
  }
};

export const saveStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
};

export const addXp = async (amount: number): Promise<UserStats> => {
  const current = await getStoredStats();
  const updated: UserStats = {
    ...current,
    xp: current.xp + amount,
  };
  await saveStats(updated);
  return updated;
};

export const completeLesson = async (lessonId: string, earnedXp: number): Promise<UserStats> => {
  const current = await getStoredStats();
  const completed = new Set(current.completedLessons);
  completed.add(lessonId);

  const updated: UserStats = {
    ...current,
    xp: current.xp + earnedXp,
    completedLessons: Array.from(completed),
  };
  await saveStats(updated);
  return updated;
};

export const toggleFavoriteCard = async (cardId: string): Promise<UserStats> => {
  const current = await getStoredStats();
  const favorites = new Set(current.favoriteCards);
  if (favorites.has(cardId)) {
    favorites.delete(cardId);
  } else {
    favorites.add(cardId);
  }
  const updated: UserStats = {
    ...current,
    favoriteCards: Array.from(favorites),
  };
  await saveStats(updated);
  return updated;
};

export const refillHearts = async (): Promise<UserStats> => {
  const current = await getStoredStats();
  const updated: UserStats = {
    ...current,
    hearts: current.maxHearts,
  };
  await saveStats(updated);
  return updated;
};

export const resetProgress = async (): Promise<UserStats> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATS));
  return INITIAL_STATS;
};
