export type ExerciseType =
  | 'multiple_choice'
  | 'listen_choose'
  | 'word_order'
  | 'translate'
  | 'true_false';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string; // Instructions in Arabic e.g. "اختر الترجمة الصحيحة"
  french?: string; // French target text
  arabic?: string; // Arabic prompt or answer
  phonetics?: string; // Arabic phonetic guide e.g. "بونجور"
  audioText?: string; // Speech text
  options?: string[]; // Multiple choice options
  correctAnswer: string; // The correct answer text
  scrambledWords?: string[]; // For word_order
  correctOrder?: string[]; // For word_order
  explanation?: string; // Didactic tip in Arabic
}

export interface LessonSummaryItem {
  french: string;
  arabic: string;
  phonetics: string;
  note?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  titleFr: string;
  description: string;
  icon: string;
  order: number;
  xpReward: number;
  overview: string;
  vocabList: LessonSummaryItem[];
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  titleFr: string;
  subtitle: string;
  icon: string;
  color: string;
  badge: string;
  lessons: Lesson[];
}

export interface Flashcard {
  id: string;
  french: string;
  arabic: string;
  phonetics: string;
  category: 'basics' | 'greetings' | 'food' | 'travel' | 'family' | 'numbers' | 'grammar';
  gender?: 'm' | 'f' | 'pl';
  exampleFr: string;
  exampleAr: string;
  examplePhonetics?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  french: string;
  arabic: string;
  phonetics: string;
  avatar: string;
  side: 'left' | 'right';
}

export interface Dialogue {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  scene: string;
  level: string;
  lines: DialogueLine[];
  keyVocab: { french: string; arabic: string; phonetics: string }[];
}

export interface GrammarExample {
  french: string;
  arabic: string;
  phonetics?: string;
  highlight?: string;
}

export interface GrammarSection {
  heading: string;
  explanation: string;
  table?: { header: string[]; rows: string[][] };
  examples: GrammarExample[];
}

export interface GrammarRule {
  id: string;
  title: string;
  titleFr: string;
  badge: string;
  summary: string;
  sections: GrammarSection[];
  proTip: string;
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface AlphabetLetter {
  letter: string;
  frenchName: string;
  arabicName: string;
  phoneticSound: string;
  exampleWordFr: string;
  exampleWordAr: string;
  examplePhonetic: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  lastActiveDate: string;
  completedLessons: string[];
  favoriteCards: string[];
  achievements: string[];
  speechSpeed: number; // 0.7 for slow, 1.0 for normal
  autoAudio: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredLessons?: number;
  isUnlocked: boolean;
}
