import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onRefillHearts?: () => void;
  onOpenAlphabet?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onRefillHearts,
  onOpenAlphabet,
}) => {
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Logo / App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.flagBadge}>
            <View style={[styles.flagStripe, { backgroundColor: '#002654' }]} />
            <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.flagStripe, { backgroundColor: '#CE1126' }]} />
          </View>
          <View>
            <Text style={styles.appTitle}>فَرَنْسِيَّتي</Text>
            <Text style={styles.appSubtitle}>Français Débutant</Text>
          </View>
        </View>

        {/* Stats Badges */}
        <View style={styles.statsRow}>
          {/* Alphabet Quick Access */}
          {onOpenAlphabet && (
            <TouchableOpacity
              style={styles.alphabetButton}
              onPress={onOpenAlphabet}
              activeOpacity={0.8}
            >
              <Text style={styles.alphabetText}>A B C</Text>
            </TouchableOpacity>
          )}

          {/* Streak */}
          <View style={styles.statPill}>
            <Ionicons name="flame" size={17} color="#F97316" />
            <Text style={styles.statValue}>{stats.streak}</Text>
          </View>

          {/* XP */}
          <View style={styles.statPill}>
            <Ionicons name="star" size={16} color="#EAB308" />
            <Text style={styles.statValue}>{stats.xp}</Text>
          </View>

          {/* Hearts */}
          <TouchableOpacity
            style={[styles.statPill, stats.hearts <= 1 && styles.statPillWarning]}
            onPress={() => setShowHeartsModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.statValue}>{stats.hearts}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Refill Hearts Modal */}
      <Modal
        visible={showHeartsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHeartsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeartIcon}>
              <Ionicons name="heart" size={48} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>قلوب المحاولات</Text>
            <Text style={styles.modalSubtitle}>
              لديك حالياً {stats.hearts} من {stats.maxHearts} قلوب. القلوب تُستخدم عند الإجابة الخاطئة لحثك على التركيز.
            </Text>

            <TouchableOpacity
              style={styles.modalRefillBtn}
              onPress={() => {
                if (onRefillHearts) onRefillHearts();
                setShowHeartsModal(false);
              }}
            >
              <Ionicons name="flash" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalRefillBtnText}>إعادة شحن القلوب كاملة مجاناً</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowHeartsModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagBadge: {
    flexDirection: 'row',
    width: 28,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flagStripe: {
    flex: 1,
    height: '100%',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    writingDirection: 'rtl',
  },
  appSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alphabetButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  alphabetText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  statPillWarning: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeartIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalRefillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    marginBottom: 10,
  },
  modalRefillBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalCloseBtn: {
    paddingVertical: 10,
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
