import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UNITS } from '../data/curriculum';
import { Unit, Lesson, UserStats } from '../types';
import { AudioButton } from '../components/AudioButton';
import { AlphabetModal } from '../components/AlphabetModal';

interface HomeScreenProps {
  stats: UserStats;
  onSelectLesson: (lesson: Lesson, unit: Unit) => void;
  onNavigateToTab: (tabName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onSelectLesson,
  onNavigateToTab,
}) => {
  const [showAlphabetModal, setShowAlphabetModal] = useState(false);

  // Daily word
  const dailyWord = {
    french: 'Magnifique !',
    arabic: 'رائع / بديع جداً',
    phonetics: 'مانييفيك !',
    exampleFr: 'La vue sur Paris est magnifique.',
    exampleAr: 'الإطلالة على باريس رائعة جداً.',
  };

  const isLessonCompleted = (lessonId: string) => {
    return stats.completedLessons.includes(lessonId);
  };

  const calculateUnitProgress = (unit: Unit) => {
    const completedCount = unit.lessons.filter((l) => isLessonCompleted(l.id)).length;
    return Math.round((completedCount / unit.lessons.length) * 100);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Daily Word Banner */}
      <View style={styles.dailyWordCard}>
        <View style={styles.dailyBadgeRow}>
          <View style={styles.dailyWordPill}>
            <Ionicons name="sparkles" size={14} color="#D97706" />
            <Text style={styles.dailyWordPillText}>كلمة اليوم (Le Mot du Jour)</Text>
          </View>
          <AudioButton text={dailyWord.french} size={20} color="#B45309" backgroundColor="#FEF3C7" />
        </View>

        <View style={styles.dailyWordBody}>
          <Text style={styles.dailyWordFr}>{dailyWord.french}</Text>
          <Text style={styles.dailyWordPhonetic}>[{dailyWord.phonetics}]</Text>
          <Text style={styles.dailyWordAr}>= {dailyWord.arabic}</Text>
        </View>

        <View style={styles.dailyWordExample}>
          <Text style={styles.dailyExampleFr}>"{dailyWord.exampleFr}"</Text>
          <Text style={styles.dailyExampleAr}>{dailyWord.exampleAr}</Text>
        </View>
      </View>

      {/* Quick Access Tiles */}
      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setShowAlphabetModal(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.quickLetters}>A B C</Text>
          </View>
          <Text style={styles.quickCardTitle}>الأبجدية والنطق</Text>
          <Text style={styles.quickCardSub}>26 حرفاً مع الصوت</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => onNavigateToTab('Flashcards')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="albums" size={22} color="#EF4444" />
          </View>
          <Text style={styles.quickCardTitle}>بطاقات الذاكرة</Text>
          <Text style={styles.quickCardSub}>قاموس المفردات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => onNavigateToTab('Conversations')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="chatbubbles" size={22} color="#10B981" />
          </View>
          <Text style={styles.quickCardTitle}>محادثات باريسية</Text>
          <Text style={styles.quickCardSub}>حوارات تفاعلية</Text>
        </TouchableOpacity>
      </View>

      {/* Units Learning Path Section Header */}
      <View style={styles.pathHeader}>
        <Text style={styles.pathTitle}>مسار التعلم المنظم</Text>
        <Text style={styles.pathSubtitle}>من الصفر حتى التحدث بالفرنسية بثقة</Text>
      </View>

      {/* Units List */}
      {UNITS.map((unit) => {
        const progress = calculateUnitProgress(unit);
        return (
          <View key={unit.id} style={styles.unitCard}>
            {/* Unit Header */}
            <View style={[styles.unitHeader, { borderLeftColor: unit.color }]}>
              <View style={styles.unitHeaderLeft}>
                <View style={[styles.unitIconCircle, { backgroundColor: unit.color }]}>
                  <Ionicons name={unit.icon as any} size={22} color="#FFFFFF" />
                </View>
                <View style={styles.unitHeaderText}>
                  <View style={styles.unitBadgeRow}>
                    <Text style={styles.unitNumber}>الوحدة {unit.number}</Text>
                    <View style={styles.unitTag}>
                      <Text style={styles.unitTagText}>{unit.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitTitleFr}>{unit.titleFr}</Text>
                </View>
              </View>

              {/* Progress Percentage */}
              <View style={styles.unitProgressWrap}>
                <Text style={[styles.unitProgressText, { color: unit.color }]}>{progress}%</Text>
                <Text style={styles.unitProgressLabel}>مكتمل</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress}%`, backgroundColor: unit.color },
                ]}
              />
            </View>

            {/* Lessons within the Unit */}
            <View style={styles.lessonsList}>
              {unit.lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id);
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[styles.lessonItem, completed && styles.lessonItemCompleted]}
                    onPress={() => onSelectLesson(lesson, unit)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.lessonLeft}>
                      <View
                        style={[
                          styles.lessonStatusCircle,
                          completed
                            ? styles.lessonStatusCompleted
                            : styles.lessonStatusPending,
                        ]}
                      >
                        {completed ? (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        ) : (
                          <Ionicons name={lesson.icon as any} size={16} color="#64748B" />
                        )}
                      </View>

                      <View style={styles.lessonTextCol}>
                        <View style={styles.lessonTopRow}>
                          <Text style={styles.lessonNumber}>الدرس {idx + 1}</Text>
                          <View style={styles.xpRewardPill}>
                            <Ionicons name="star" size={10} color="#D97706" />
                            <Text style={styles.xpRewardText}>+{lesson.xpReward} XP</Text>
                          </View>
                        </View>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonTitleFr}>{lesson.titleFr}</Text>
                      </View>
                    </View>

                    <View style={styles.lessonActionArrow}>
                      <Ionicons
                        name={completed ? 'refresh' : 'play'}
                        size={18}
                        color={completed ? '#10B981' : '#2563EB'}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* Bottom Section: Tips & Motivation for Beginners */}
      <View style={styles.bottomSection}>
        {/* French Motivational Quote Card */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <View style={styles.quoteBadge}>
              <Ionicons name="sparkles" size={14} color="#D97706" />
              <Text style={styles.quoteBadgeText}>حكمة اليوم الفرنسية</Text>
            </View>
            <AudioButton
              text="Vouloir, c'est pouvoir"
              size={18}
              color="#B45309"
              backgroundColor="#FEF3C7"
            />
          </View>
          <Text style={styles.quoteFrenchText}>"Vouloir, c'est pouvoir"</Text>
          <Text style={styles.quotePhoneticText}>[فولوار، سيه بوفوار]</Text>
          <Text style={styles.quoteArabicText}>= من أراد استطاع (العزيمة تصنع المستحيل)</Text>
        </View>

        {/* 3 Golden Beginner Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeaderRow}>
            <Ionicons name="bulb" size={18} color="#2563EB" />
            <Text style={styles.tipsHeaderTitle}>نصائح ذهبية لإتقان النطق الفرنسي للمبتدئين:</Text>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipBullet}>
              <Text style={styles.tipBulletText}>1</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>الحروف الساكنة في النهايات صامتة</Text>
              <Text style={styles.tipDesc}>
                حروف (d, p, s, t, x, z) في آخر الكلمات الفرنسية غالباً لا تُلفظ، مثل Salut تُنطق (سالو) و Paris تُنطق (باري).
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipBullet}>
              <Text style={styles.tipBulletText}>2</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>حرف H لا يُلفظ إطلاقاً</Text>
              <Text style={styles.tipDesc}>
                في الفرنسية حرف H صامت دائماً ولا يوجد صوت الهاء، فكلمة Hôtel تُلفظ (أوتيل) و Heure تُلفظ (أور).
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipBullet}>
              <Text style={styles.tipBulletText}>3</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>الاستمرار 10 دقائق يومياً يصنع المعجزات</Text>
              <Text style={styles.tipDesc}>
                الاستماع المنتظم لنطق الكلمات وتكرارها بصوت عالٍ يبني ذاكرة صوتية وعضلية للسان في وقت قياسي.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Bottom Actions */}
        <View style={styles.bottomActionsCard}>
          <Text style={styles.bottomActionsTitle}>استمر في تدريبك الآن:</Text>
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity
              style={styles.bottomActionBtn}
              onPress={() => onNavigateToTab('Flashcards')}
              activeOpacity={0.8}
            >
              <Ionicons name="albums" size={18} color="#2563EB" />
              <Text style={styles.bottomActionBtnText}>مراجعة الكلمات</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomActionBtn, styles.bottomActionBtnSecondary]}
              onPress={() => onNavigateToTab('Conversations')}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubbles" size={18} color="#059669" />
              <Text style={[styles.bottomActionBtnText, { color: '#059669' }]}>
                حوارات باريس
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Bottom Footer */}
        <View style={styles.appFooter}>
          <View style={styles.footerFlagRow}>
            <View style={[styles.footerFlagStripe, { backgroundColor: '#002654' }]} />
            <View style={[styles.footerFlagStripe, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.footerFlagStripe, { backgroundColor: '#CE1126' }]} />
          </View>
          <Text style={styles.footerBrandHighlight}>منصة مداد الذكي طريقك للتعلم بشغف</Text>
          <Text style={styles.footerAuthor}>تم إنشاؤه من طرف الشيخاني محفوظ لبشير.</Text>
        </View>
      </View>

      {/* Alphabet Modal */}
      <AlphabetModal
        visible={showAlphabetModal}
        onClose={() => setShowAlphabetModal(false)}
      />
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
  dailyWordCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyWordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dailyWordPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  dailyWordBody: {
    marginBottom: 10,
  },
  dailyWordFr: {
    fontSize: 24,
    fontWeight: '900',
    color: '#78350F',
  },
  dailyWordPhonetic: {
    fontSize: 14,
    color: '#B45309',
    fontWeight: '600',
    marginTop: 2,
  },
  dailyWordAr: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginTop: 2,
  },
  dailyWordExample: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  dailyExampleFr: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  dailyExampleAr: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLetters: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563EB',
  },
  quickCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  quickCardSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  pathHeader: {
    marginBottom: 14,
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  pathSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 2,
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 5,
  },
  unitHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  unitIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitHeaderText: {
    flex: 1,
  },
  unitBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  unitNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  unitTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  unitTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  unitTitleFr: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  unitProgressWrap: {
    alignItems: 'center',
    marginLeft: 8,
  },
  unitProgressText: {
    fontSize: 16,
    fontWeight: '800',
  },
  unitProgressLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
  },
  lessonsList: {
    padding: 12,
    gap: 8,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lessonItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  lessonStatusCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonStatusPending: {
    backgroundColor: '#E2E8F0',
  },
  lessonStatusCompleted: {
    backgroundColor: '#10B981',
  },
  lessonTextCol: {
    flex: 1,
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  lessonNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  xpRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 2,
  },
  xpRewardText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  lessonTitleFr: {
    fontSize: 11,
    color: '#64748B',
  },
  lessonActionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomSection: {
    marginTop: 10,
    gap: 16,
  },
  quoteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quoteBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  quoteFrenchText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#78350F',
    fontStyle: 'italic',
  },
  quotePhoneticText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '600',
    marginTop: 2,
  },
  quoteArabicText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'right',
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipsHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 2,
  },
  tipBulletText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
  },
  tipDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 2,
    textAlign: 'right',
  },
  bottomActionsCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  bottomActionsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'right',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  bottomActionBtnSecondary: {
    borderColor: '#A7F3D0',
  },
  bottomActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  appFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  footerFlagRow: {
    flexDirection: 'row',
    width: 32,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  footerFlagStripe: {
    flex: 1,
    height: '100%',
  },
  footerBrandHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  footerAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
});
