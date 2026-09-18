import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GRAMMAR_RULES } from '../data/grammar';
import { GrammarRule } from '../types';
import { AudioButton } from '../components/AudioButton';
import { speechService } from '../services/speech';

export const GrammarScreen: React.FC = () => {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>('gram_1');

  const toggleRule = (id: string) => {
    setExpandedRuleId(expandedRuleId === id ? null : id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="school" size={26} color="#7C3AED" />
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>دليل القواعد الفرنسية المبسطة</Text>
          <Text style={styles.bannerSubtitle}>
            شرح ميسر لأهم القواعد مع أمثلة صوتية وتنبيهات للأخطاء الشائعة
          </Text>
        </View>
      </View>

      <Text style={styles.sectionHeading}>القواعد الأساسية للمبتدئ:</Text>

      {GRAMMAR_RULES.map((rule) => {
        const isExpanded = expandedRuleId === rule.id;
        return (
          <View key={rule.id} style={styles.ruleCard}>
            {/* Header Accordion */}
            <TouchableOpacity
              style={styles.ruleHeader}
              onPress={() => toggleRule(rule.id)}
              activeOpacity={0.8}
            >
              <View style={styles.ruleHeaderLeft}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{rule.badge}</Text>
                </View>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                <Text style={styles.ruleTitleFr}>{rule.titleFr}</Text>
              </View>

              <Ionicons
                name={isExpanded ? 'chevron-up-circle' : 'chevron-down-circle'}
                size={24}
                color="#7C3AED"
              />
            </TouchableOpacity>

            {/* Rule Body */}
            {isExpanded && (
              <View style={styles.ruleBody}>
                {/* Summary */}
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>{rule.summary}</Text>
                </View>

                {/* Sections */}
                {rule.sections.map((sec, secIdx) => (
                  <View key={secIdx} style={styles.sectionWrap}>
                    <Text style={styles.sectionTitle}>{sec.heading}</Text>
                    <Text style={styles.sectionExplanation}>{sec.explanation}</Text>

                    {/* Table if exists (e.g. Conjugation) */}
                    {sec.table && (
                      <View style={styles.tableWrapper}>
                        {/* Table Header */}
                        <View style={styles.tableHeaderRow}>
                          {sec.table.header.map((col, cIdx) => (
                            <Text key={cIdx} style={styles.tableHeaderText}>
                              {col}
                            </Text>
                          ))}
                        </View>

                        {/* Table Rows */}
                        {sec.table.rows.map((row, rIdx) => (
                          <TouchableOpacity
                            key={rIdx}
                            style={[
                              styles.tableRow,
                              rIdx % 2 === 1 && styles.tableRowAlt,
                            ]}
                            onPress={() => speechService.speak(row[0] + ' ' + row[1], 0.85)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.tableCellSubject}>{row[0]}</Text>
                            <Text style={styles.tableCellVerb}>{row[1]}</Text>
                            <Text style={styles.tableCellMeaning}>{row[2]}</Text>
                            <Text style={styles.tableCellExample}>{row[3]}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Examples list */}
                    {sec.examples && sec.examples.length > 0 && (
                      <View style={styles.examplesList}>
                        {sec.examples.map((ex, exIdx) => (
                          <View key={exIdx} style={styles.exampleItem}>
                            <View style={styles.exampleTextCol}>
                              <Text style={styles.exampleFrench}>{ex.french}</Text>
                              {ex.phonetics && (
                                <Text style={styles.examplePhonetic}>[{ex.phonetics}]</Text>
                              )}
                              <Text style={styles.exampleArabic}>{ex.arabic}</Text>
                            </View>
                            <AudioButton text={ex.french} size={20} color="#7C3AED" />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}

                {/* Pro Tip */}
                {rule.proTip && (
                  <View style={styles.proTipBox}>
                    <Ionicons name="bulb" size={20} color="#D97706" />
                    <Text style={styles.proTipText}>{rule.proTip}</Text>
                  </View>
                )}

                {/* Common Mistake Alert */}
                {rule.commonMistake && (
                  <View style={styles.mistakeBox}>
                    <View style={styles.mistakeHeader}>
                      <Ionicons name="warning" size={18} color="#DC2626" />
                      <Text style={styles.mistakeTitle}>خطأ شائع يقع فيه الكثيرون:</Text>
                    </View>

                    <View style={styles.mistakeCompareRow}>
                      <View style={styles.mistakeColWrong}>
                        <Text style={styles.wrongLabel}>❌ خطأ:</Text>
                        <Text style={styles.wrongText}>{rule.commonMistake.wrong}</Text>
                      </View>
                      <View style={styles.mistakeColRight}>
                        <Text style={styles.rightLabel}>✅ صواب:</Text>
                        <Text style={styles.rightText}>{rule.commonMistake.right}</Text>
                      </View>
                    </View>

                    <Text style={styles.mistakeExplanation}>
                      {rule.commonMistake.explanation}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 20,
    gap: 14,
  },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5B21B6',
    textAlign: 'right',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#6D28D9',
    marginTop: 2,
    lineHeight: 18,
    textAlign: 'right',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textAlign: 'right',
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  ruleHeaderLeft: {
    flex: 1,
    gap: 2,
  },
  badgePill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  ruleTitleFr: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  ruleBody: {
    padding: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  summaryText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    textAlign: 'right',
    fontWeight: '600',
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'right',
  },
  sectionExplanation: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 18,
    textAlign: 'right',
  },
  tableWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCellSubject: {
    flex: 0.8,
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  tableCellVerb: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    textAlign: 'center',
  },
  tableCellMeaning: {
    flex: 1.2,
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  tableCellExample: {
    flex: 1.6,
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  examplesList: {
    gap: 8,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  exampleTextCol: {
    flex: 1,
  },
  exampleFrench: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  examplePhonetic: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  exampleArabic: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    textAlign: 'right',
  },
  proTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
    gap: 10,
  },
  proTipText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    textAlign: 'right',
    fontWeight: '600',
  },
  mistakeBox: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  mistakeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  mistakeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  mistakeCompareRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  mistakeColWrong: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  wrongLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 2,
  },
  wrongText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    textDecorationLine: 'line-through',
  },
  mistakeColRight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 2,
  },
  rightText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  mistakeExplanation: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 16,
    textAlign: 'right',
  },
});
