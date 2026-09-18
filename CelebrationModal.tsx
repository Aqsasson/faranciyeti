import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { speechService } from '../services/speech';

interface CelebrationModalProps {
  visible: boolean;
  xpEarned: number;
  correctCount: number;
  totalQuestions: number;
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  xpEarned,
  correctCount,
  totalQuestions,
  onContinue,
}) => {
  useEffect(() => {
    if (visible) {
      // Speak encouraging French cheer
      speechService.speak('Bravo ! Félicitations !', 0.95);

      // Trigger Web Confetti if running in web browser
      if (Platform.OS === 'web') {
        try {
          const confetti = require('canvas-confetti');
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        } catch {
          // ignore
        }
      }
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Trophy Badge */}
          <View style={styles.trophyRing}>
            <View style={styles.trophyInner}>
              <Ionicons name="trophy" size={48} color="#F59E0B" />
            </View>
          </View>

          {/* Titles */}
          <Text style={styles.frenchPraise}>Félicitations !</Text>
          <Text style={styles.arabicPraise}>أحسنت صنعاً! أتممت الدرس بنجاح</Text>

          {/* Stats Badges */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconBadgeXp}>
                <Ionicons name="star" size={20} color="#EAB308" />
              </View>
              <Text style={styles.statNumber}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>نقاط خبرة XP</Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statIconBadgeAccuracy}>
                <Ionicons name="checkmark-done" size={20} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>
                {correctCount} / {totalQuestions}
              </Text>
              <Text style={styles.statLabel}>إجابات صحيحة</Text>
            </View>
          </View>

          {/* Proverb / Motivating note */}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteFr}>"Petit à petit, l'oiseau fait son nid."</Text>
            <Text style={styles.quoteAr}>رويداً رويداً، يبني الطائر عشه (خطوة بخطوة تتقن اللغة)</Text>
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>متابعة التقدم</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  trophyRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FDE68A',
  },
  trophyInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frenchPraise: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },
  arabicPraise: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
    marginBottom: 18,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconBadgeXp: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIconBadgeAccuracy: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  quoteBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  quoteFr: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAr: {
    fontSize: 11,
    color: '#3B82F6',
    textAlign: 'center',
    marginTop: 2,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
