import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserStats } from '../types';
import { speechService } from '../services/speech';

interface ProfileScreenProps {
  stats: UserStats;
  onUpdateSpeed: (speed: number) => void;
  onRefillHearts: () => void;
  onResetProgress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  stats,
  onUpdateSpeed,
  onRefillHearts,
  onResetProgress,
}) => {
  const [speed, setSpeed] = useState<number>(stats.speechSpeed || 0.9);

  const achievements = [
    {
      id: 'first_step',
      title: 'الخطوة الأولى',
      titleFr: 'Premier Pas',
      desc: 'أتممت أول درس في مسار التعلم بنجاح',
      icon: 'footsteps',
      unlocked: stats.completedLessons.length >= 1,
    },
    {
      id: 'curious_learner',
      title: 'مستكشف الحروف',
      titleFr: 'Explorateur de l’Alphabet',
      desc: 'تعرفت على أسرار النطق الصوتي للفرنسية',
      icon: 'sparkles',
      unlocked: true,
    },
    {
      id: 'streak_master',
      title: 'شعلة الاستمرار',
      titleFr: 'Flamme d’Assiduité',
      desc: 'تعلمت لمدة 3 أيام متتالية دون انقطاع',
      icon: 'flame',
      unlocked: stats.streak >= 3,
    },
    {
      id: 'vocab_collector',
      title: 'جامع الكلمات',
      titleFr: 'Maître du Vocabulaire',
      desc: 'حفظت كلمات في بطاقاتك المفضلة',
      icon: 'albums',
      unlocked: stats.favoriteCards.length >= 2,
    },
    {
      id: 'dialogue_hero',
      title: 'بلبل المحادثة',
      titleFr: 'Champion du Dialogue',
      desc: 'تدرّبت على المحادثات الباريسية اليومية',
      icon: 'chatbubbles',
      unlocked: stats.xp >= 150,
    },
  ];

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onUpdateSpeed(newSpeed);
    speechService.speak('Bonjour, je parle français !', newSpeed);
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'إعادة تعيين التقدم',
      'هل تريد فعلاً تصفير التقدم والبدء من جديد من الصفر؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم، أعد التعيين',
          style: 'destructive',
          onPress: onResetProgress,
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#2563EB" />
          </View>
          <View style={styles.avatarBadge}>
            <Ionicons name="ribbon" size={14} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.userName}>مُتعلّم فرنسيتي النشط</Text>
        <Text style={styles.userLevel}>مستوى A1 - مبتدئ واثق (Débutant Confiant)</Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Ionicons name="star" size={20} color="#EAB308" />
            <Text style={styles.statValue}>{stats.xp}</Text>
            <Text style={styles.statLabel}>مجموع الـ XP</Text>
          </View>

          <View style={styles.statTile}>
            <Ionicons name="flame" size={20} color="#F97316" />
            <Text style={styles.statValue}>{stats.streak} أيام</Text>
            <Text style={styles.statLabel}>أيام التتالي</Text>
          </View>

          <View style={styles.statTile}>
            <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
            <Text style={styles.statValue}>{stats.completedLessons.length}</Text>
            <Text style={styles.statLabel}>دروس مكتملة</Text>
          </View>

          <View style={styles.statTile}>
            <Ionicons name="heart" size={20} color="#EF4444" />
            <Text style={styles.statValue}>{stats.hearts} / 5</Text>
            <Text style={styles.statLabel}>قلوب الطاقة</Text>
          </View>
        </View>
      </View>

      {/* Refill Hearts Banner if low */}
      {stats.hearts < 5 && (
        <TouchableOpacity
          style={styles.refillBanner}
          onPress={onRefillHearts}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={24} color="#EF4444" />
          <View style={styles.refillTextCol}>
            <Text style={styles.refillTitle}>اشحن قلوب المحاولات كاملة مجاناً</Text>
            <Text style={styles.refillSub}>اضغط هنا لاستعادة 5 قلوب لمواصلة التمارين</Text>
          </View>
          <Ionicons name="flash" size={20} color="#D97706" />
        </TouchableOpacity>
      )}

      {/* Audio Speed Settings */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="volume-medium" size={20} color="#2563EB" />
          <Text style={styles.sectionHeaderTitle}>سرعة النطق الصوتي الفرنسي</Text>
        </View>
        <Text style={styles.sectionHeaderDesc}>
          اختر السرعة التي تناسب أذنك حالياً، ثم اضغط للاستماع للتجربة:
        </Text>

        <View style={styles.speedOptionsRow}>
          <TouchableOpacity
            style={[styles.speedChoice, speed < 0.8 && styles.speedChoiceActive]}
            onPress={() => handleSpeedChange(0.68)}
            activeOpacity={0.7}
          >
            <Text style={styles.speedEmoji}>🐢</Text>
            <Text style={[styles.speedText, speed < 0.8 && styles.speedTextActive]}>
              نطق بطيء للمبتدئ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedChoice, speed >= 0.8 && styles.speedChoiceActive]}
            onPress={() => handleSpeedChange(0.92)}
            activeOpacity={0.7}
          >
            <Text style={styles.speedEmoji}>🐇</Text>
            <Text style={[styles.speedText, speed >= 0.8 && styles.speedTextActive]}>
              نطق طبيعي واقعي
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Achievements Collection */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.sectionHeaderTitle}>أوسمة وإنجازات التعلم</Text>
        </View>

        <View style={styles.achievementsList}>
          {achievements.map((ach) => (
            <View
              key={ach.id}
              style={[
                styles.achievementItem,
                !ach.unlocked && styles.achievementItemLocked,
              ]}
            >
              <View
                style={[
                  styles.achievementIconCircle,
                  ach.unlocked
                    ? styles.achievementIconUnlocked
                    : styles.achievementIconLocked,
                ]}
              >
                <Ionicons
                  name={ach.icon as any}
                  size={20}
                  color={ach.unlocked ? '#D97706' : '#94A3B8'}
                />
              </View>

              <View style={styles.achievementTextCol}>
                <View style={styles.achievementTitleRow}>
                  <Text style={styles.achievementTitle}>{ach.title}</Text>
                  <Text style={styles.achievementTitleFr}>({ach.titleFr})</Text>
                </View>
                <Text style={styles.achievementDesc}>{ach.desc}</Text>
              </View>

              {ach.unlocked ? (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed" size={16} color="#94A3B8" />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* About App & Reset */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutFlagRow}>
          <View style={[styles.flagDot, { backgroundColor: '#002654' }]} />
          <View style={[styles.flagDot, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.flagDot, { backgroundColor: '#CE1126' }]} />
        </View>
        <Text style={styles.aboutTitle}>منصة مداد الذكي طريقك للتعلم بشغف</Text>
        <Text style={styles.aboutAuthor}>تم إنشاؤه من طرف الشيخاني محفوظ لبشير.</Text>
        <Text style={styles.aboutText}>
          تطبيق متكامل مصمم خصيصاً لمساعدة المبتدئين والناطقين بالعربية على إتقان اللغة
          الفرنسية خطوة بخطوة مع النطق الصوتي الدقيق والتدريبات التفاعلية.
        </Text>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleConfirmReset}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={16} color="#EF4444" />
          <Text style={styles.resetText}>إعادة تعيين التقدم والبدء من جديد</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#BFDBFE',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userLevel: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  refillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 12,
  },
  refillTextCol: {
    flex: 1,
  },
  refillTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'right',
  },
  refillSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHeaderDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    textAlign: 'right',
    lineHeight: 18,
  },
  speedOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  speedChoice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  speedChoiceActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  speedEmoji: {
    fontSize: 18,
  },
  speedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  speedTextActive: {
    color: '#1D4ED8',
  },
  achievementsList: {
    gap: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  achievementItemLocked: {
    opacity: 0.6,
  },
  achievementIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: '#FEF3C7',
  },
  achievementIconLocked: {
    backgroundColor: '#E2E8F0',
  },
  achievementTextCol: {
    flex: 1,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  achievementTitleFr: {
    fontSize: 11,
    color: '#64748B',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
  unlockedBadge: {
    padding: 2,
  },
  lockedBadge: {
    padding: 2,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aboutFlagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  flagDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  aboutAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 3,
  },
  aboutText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
});
