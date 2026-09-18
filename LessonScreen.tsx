import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Lesson, Unit, Exercise, UserStats } from '../types';
import { AudioButton } from '../components/AudioButton';
import { CelebrationModal } from '../components/CelebrationModal';
import { speechService } from '../services/speech';

interface LessonScreenProps {
  lesson: Lesson;
  unit: Unit;
  stats: UserStats;
  onBack: () => void;
  onLessonComplete: (earnedXp: number, correctAnswers: number, totalQuestions: number) => void;
  onHeartLost: () => void;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({
  lesson,
  unit,
  stats,
  onBack,
  onLessonComplete,
  onHeartLost,
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'quiz'>('study');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const exercises = lesson.exercises;
  const currentExercise: Exercise | undefined = exercises[currentQuestionIndex];

  // Initialize word order puzzle if applicable
  React.useEffect(() => {
    if (currentExercise && currentExercise.type === 'word_order' && currentExercise.scrambledWords) {
      setAvailableWords([...currentExercise.scrambledWords]);
      setAssembledWords([]);
    }
    setSelectedOption(null);
    setIsAnswerChecked(false);
  }, [currentQuestionIndex, currentExercise]);

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleWordTap = (word: string, fromAssembled: boolean) => {
    if (isAnswerChecked) return;
    if (fromAssembled) {
      // Remove from assembled, return to available
      setAssembledWords((prev) => prev.filter((w, idx) => !(w === word && prev.indexOf(w) === idx)));
      setAvailableWords((prev) => [...prev, word]);
    } else {
      // Add to assembled, remove from available
      setAssembledWords((prev) => [...prev, word]);
      setAvailableWords((prev) => {
        const next = [...prev];
        const idx = next.indexOf(word);
        if (idx > -1) next.splice(idx, 1);
        return next;
      });
    }
  };

  const handleCheckAnswer = () => {
    if (!currentExercise || isAnswerChecked) return;

    let userCorrect = false;
    if (currentExercise.type === 'word_order') {
      const builtSentence = assembledWords.join(' ');
      userCorrect = builtSentence.trim() === currentExercise.correctAnswer.trim();
    } else {
      userCorrect = selectedOption?.trim() === currentExercise.correctAnswer.trim();
    }

    setIsCorrect(userCorrect);
    setIsAnswerChecked(true);

    if (userCorrect) {
      setCorrectCount((prev) => prev + 1);
      speechService.speak('Très bien !', 1.0);
    } else {
      onHeartLost();
      speechService.speak('Attention !', 1.0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Finished all questions!
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    onLessonComplete(lesson.xpReward, correctCount + (isCorrect ? 1 : 0), exercises.length);
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={styles.unitBadgeText}>{unit.title}</Text>
          <Text style={styles.lessonHeading} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>

        <View style={styles.heartsPill}>
          <Ionicons name="heart" size={16} color="#EF4444" />
          <Text style={styles.heartsText}>{stats.hearts}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'study' && styles.tabItemActive]}
          onPress={() => setActiveTab('study')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="book"
            size={16}
            color={activeTab === 'study' ? '#2563EB' : '#64748B'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'study' && styles.tabLabelActive]}
          >
            المفردات والشرح
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'quiz' && styles.tabItemActive]}
          onPress={() => setActiveTab('quiz')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="school"
            size={16}
            color={activeTab === 'quiz' ? '#2563EB' : '#64748B'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'quiz' && styles.tabLabelActive]}
          >
            تمارين التثبيت ({exercises.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode 1: Study & Vocab */}
      {activeTab === 'study' ? (
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="information-circle" size={20} color="#2563EB" />
              <Text style={styles.overviewTitle}>نظرة عامة على الدرس</Text>
            </View>
            <Text style={styles.overviewDesc}>{lesson.overview}</Text>
          </View>

          {/* French Vocabulary Cards */}
          <Text style={styles.vocabSectionHeader}>الكلمات والعبارات الرئيسية مع النطق:</Text>
          {lesson.vocabList.map((item, idx) => (
            <View key={idx} style={styles.vocabCard}>
              <View style={styles.vocabMainRow}>
                <View style={styles.vocabTextCol}>
                  <Text style={styles.vocabFrench}>{item.french}</Text>
                  <Text style={styles.vocabPhonetic}>[{item.phonetics}]</Text>
                  <Text style={styles.vocabArabic}>{item.arabic}</Text>
                </View>

                {/* Audio Buttons (Normal + Slow) */}
                <View style={styles.vocabAudioCol}>
                  <AudioButton text={item.french} size={22} color="#1D4ED8" backgroundColor="#DBEAFE" />
                  <TouchableOpacity
                    style={styles.slowAudioBtn}
                    onPress={() => speechService.speak(item.french, 0.65)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.slowAudioText}>بطيء 🐢</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {item.note && (
                <View style={styles.vocabNoteBox}>
                  <Text style={styles.vocabNoteText}>💡 {item.note}</Text>
                </View>
              )}
            </View>
          ))}

          {/* Jump to Quiz Button */}
          <TouchableOpacity
            style={styles.startQuizButton}
            onPress={() => setActiveTab('quiz')}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-forward-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.startQuizButtonText}>جاهز للاختبار؟ ابدأ التمارين التفاعلية</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        /* Mode 2: Interactive Quiz */
        <View style={styles.quizContainer}>
          {currentExercise ? (
            <View style={styles.quizInner}>
              {/* Progress Tracker */}
              <View style={styles.quizProgressBarContainer}>
                <View style={styles.quizProgressHeader}>
                  <Text style={styles.quizProgressStep}>
                    السؤال {currentQuestionIndex + 1} من {exercises.length}
                  </Text>
                  <Text style={styles.quizProgressXp}>+{lesson.xpReward} XP</Text>
                </View>
                <View style={styles.quizProgressTrack}>
                  <View
                    style={[
                      styles.quizProgressFill,
                      {
                        width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <ScrollView
                style={styles.quizScroll}
                contentContainerStyle={styles.quizScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Question Prompt */}
                <View style={styles.questionBox}>
                  <Text style={styles.questionPrompt}>{currentExercise.prompt}</Text>

                  {/* Target French / Audio Display */}
                  {currentExercise.audioText ? (
                    <View style={styles.audioTargetBox}>
                      <AudioButton
                        text={currentExercise.audioText}
                        size={32}
                        color="#2563EB"
                        backgroundColor="#EFF6FF"
                      />
                      <Text style={styles.audioTargetHint}>اضغط للاستماع إلى النطق الفرنسي</Text>
                    </View>
                  ) : currentExercise.french ? (
                    <View style={styles.frenchDisplayCard}>
                      <Text style={styles.frenchTargetText}>{currentExercise.french}</Text>
                      {currentExercise.phonetics && (
                        <Text style={styles.phoneticTargetText}>
                          [{currentExercise.phonetics}]
                        </Text>
                      )}
                      <AudioButton
                        text={currentExercise.french}
                        size={20}
                        color="#2563EB"
                        style={{ marginTop: 6 }}
                      />
                    </View>
                  ) : null}
                </View>

                {/* Exercise Type: Word Order */}
                {currentExercise.type === 'word_order' ? (
                  <View style={styles.wordOrderContainer}>
                    <Text style={styles.orderLabel}>الكلمات المرتبة (اضغط لإزالتها):</Text>
                    <View style={styles.assembledArea}>
                      {assembledWords.length === 0 ? (
                        <Text style={styles.emptyOrderHint}>
                          اضغط على الكلمات بالأسفل لترتيبها هنا
                        </Text>
                      ) : (
                        assembledWords.map((w, i) => (
                          <TouchableOpacity
                            key={i}
                            style={styles.wordChipAssembled}
                            onPress={() => handleWordTap(w, true)}
                          >
                            <Text style={styles.wordChipText}>{w}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>

                    <Text style={styles.orderLabel}>الكلمات المتاحة للاختيار:</Text>
                    <View style={styles.availableArea}>
                      {availableWords.map((w, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.wordChipAvailable}
                          onPress={() => handleWordTap(w, false)}
                        >
                          <Text style={styles.wordChipText}>{w}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : (
                  /* Multiple Choice / Listen Choose / True False */
                  <View style={styles.optionsList}>
                    {currentExercise.options?.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      let optionStyle = styles.optionCard;

                      if (isAnswerChecked) {
                        if (option === currentExercise.correctAnswer) {
                          optionStyle = styles.optionCardCorrect;
                        } else if (isSelected && !isCorrect) {
                          optionStyle = styles.optionCardWrong;
                        }
                      } else if (isSelected) {
                        optionStyle = styles.optionCardSelected;
                      }

                      return (
                        <TouchableOpacity
                          key={idx}
                          style={optionStyle}
                          onPress={() => handleSelectOption(option)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.optionRadio}>
                            {isSelected && <View style={styles.optionRadioDot} />}
                          </View>
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Feedback Banner */}
                {isAnswerChecked && (
                  <View
                    style={[
                      styles.feedbackCard,
                      isCorrect ? styles.feedbackCardCorrect : styles.feedbackCardWrong,
                    ]}
                  >
                    <View style={styles.feedbackHeader}>
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={isCorrect ? '#10B981' : '#EF4444'}
                      />
                      <Text
                        style={[
                          styles.feedbackTitle,
                          { color: isCorrect ? '#065F46' : '#991B1B' },
                        ]}
                      >
                        {isCorrect ? 'إجابة صحيحة! أحسنت ⭐️' : 'إجابة غير صحيحة'}
                      </Text>
                    </View>

                    {!isCorrect && (
                      <Text style={styles.feedbackCorrectAnswer}>
                        الإجابة الصحيحة هي: {currentExercise.correctAnswer}
                      </Text>
                    )}

                    {currentExercise.explanation && (
                      <Text style={styles.feedbackExplanation}>
                        💡 {currentExercise.explanation}
                      </Text>
                    )}
                  </View>
                )}
              </ScrollView>

              {/* Bottom Action Button */}
              <View style={styles.bottomActionBar}>
                {!isAnswerChecked ? (
                  <TouchableOpacity
                    style={[
                      styles.actionCheckButton,
                      !(
                        selectedOption ||
                        (currentExercise.type === 'word_order' && assembledWords.length > 0)
                      ) && styles.actionCheckButtonDisabled,
                    ]}
                    onPress={handleCheckAnswer}
                    disabled={
                      !(
                        selectedOption ||
                        (currentExercise.type === 'word_order' && assembledWords.length > 0)
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionCheckText}>تحقق من الإجابة</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.actionNextButton,
                      isCorrect ? styles.actionNextCorrect : styles.actionNextWrong,
                    ]}
                    onPress={handleNextQuestion}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionNextText}>
                      {currentQuestionIndex < exercises.length - 1
                        ? 'السؤال التالي'
                        : 'إنهاء الدرس ورؤية النتيجة 🏆'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}
        </View>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        xpEarned={lesson.xpReward}
        correctCount={correctCount}
        totalQuestions={exercises.length}
        onContinue={handleCelebrationContinue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  unitBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  lessonHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  heartsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 4,
  },
  heartsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EF4444',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabItemActive: {
    borderBottomColor: '#2563EB',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#2563EB',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  overviewCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  overviewDesc: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
    textAlign: 'right',
  },
  vocabSectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textAlign: 'right',
  },
  vocabCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  vocabMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vocabTextCol: {
    flex: 1,
  },
  vocabFrench: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  vocabPhonetic: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  vocabArabic: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
  },
  vocabAudioCol: {
    alignItems: 'center',
    gap: 6,
  },
  slowAudioBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  slowAudioText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  vocabNoteBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vocabNoteText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    textAlign: 'right',
  },
  startQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startQuizButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quizContainer: {
    flex: 1,
  },
  quizInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  quizProgressBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  quizProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quizProgressStep: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  quizProgressXp: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  quizProgressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  quizScroll: {
    flex: 1,
  },
  quizScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  questionBox: {
    marginBottom: 20,
  },
  questionPrompt: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    marginBottom: 14,
    lineHeight: 24,
  },
  audioTargetBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audioTargetHint: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
  frenchDisplayCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  frenchTargetText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  phoneticTargetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionCardCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionCardWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  wordOrderContainer: {
    gap: 10,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'right',
  },
  assembledArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 60,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyOrderHint: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
  availableArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 6,
  },
  wordChipAssembled: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  wordChipAvailable: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  wordChipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  feedbackCard: {
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
  },
  feedbackCardCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  feedbackCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  feedbackCorrectAnswer: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
    textAlign: 'right',
  },
  feedbackExplanation: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    textAlign: 'right',
  },
  bottomActionBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionCheckButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionCheckButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  actionCheckText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionNextCorrect: {
    backgroundColor: '#10B981',
  },
  actionNextWrong: {
    backgroundColor: '#2563EB',
  },
  actionNextText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
