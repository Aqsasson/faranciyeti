import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FLASHCARDS } from '../data/flashcards';
import { Flashcard, UserStats } from '../types';
import { AudioButton } from '../components/AudioButton';
import { speechService } from '../services/speech';

interface FlashcardsScreenProps {
  stats: UserStats;
  onToggleFavorite: (cardId: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'greetings', label: 'التحيات' },
  { id: 'basics', label: 'الأساسيات' },
  { id: 'food', label: 'المطعم والمقهى' },
  { id: 'travel', label: 'السفر والاتجاهات' },
  { id: 'family', label: 'العائلة' },
  { id: 'numbers', label: 'الأرقام والوقت' },
  { id: 'favorites', label: 'المفضلة ⭐️' },
];

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({
  stats,
  onToggleFavorite,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter((card) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!stats.favoriteCards.includes(card.id)) return false;
      } else if (activeCategory !== 'all') {
        if (card.category !== activeCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchFr = card.french.toLowerCase().includes(query);
        const matchAr = card.arabic.includes(query);
        const matchPhonetic = card.phonetics.includes(query);
        return matchFr || matchAr || matchPhonetic;
      }
      return true;
    });
  }, [activeCategory, searchQuery, stats.favoriteCards]);

  const currentCard: Flashcard | undefined = filteredCards[cardIndex] || filteredCards[0];

  const handleNextCard = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrevCard = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMarkMastered = (cardId: string) => {
    if (!masteredIds.includes(cardId)) {
      setMasteredIds((prev) => [...prev, cardId]);
    }
    handleNextCard();
  };

  return (
    <View style={styles.container}>
      {/* Search & Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالفرنسية أو العربية..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setCardIndex(0);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* View Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, viewMode === 'card' && styles.modeBtnActive]}
            onPress={() => setViewMode('card')}
          >
            <Ionicons
              name="albums"
              size={18}
              color={viewMode === 'card' ? '#2563EB' : '#64748B'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, viewMode === 'list' && styles.modeBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === 'list' ? '#2563EB' : '#64748B'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
              >
                <Text
                  style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Mode 1: Interactive Flip Card */}
      {viewMode === 'card' ? (
        filteredCards.length > 0 && currentCard ? (
          <View style={styles.cardViewContainer}>
            {/* Card Counter & Favorite */}
            <View style={styles.cardHeaderRow}>
              <TouchableOpacity
                onPress={() => onToggleFavorite(currentCard.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={stats.favoriteCards.includes(currentCard.id) ? 'star' : 'star-outline'}
                  size={22}
                  color={stats.favoriteCards.includes(currentCard.id) ? '#F59E0B' : '#94A3B8'}
                />
              </TouchableOpacity>

              <Text style={styles.counterText}>
                {cardIndex + 1} من {filteredCards.length}
              </Text>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{currentCard.category}</Text>
              </View>
            </View>

            {/* Flippable Card */}
            <TouchableOpacity
              style={[styles.mainFlashcard, isFlipped ? styles.cardBack : styles.cardFront]}
              onPress={() => setIsFlipped(!isFlipped)}
              activeOpacity={0.9}
            >
              {!isFlipped ? (
                /* Front Side (French) */
                <View style={styles.cardContent}>
                  <View style={styles.flagIconRow}>
                    <Text style={styles.sideLabel}>الوجه الفرنسي 🇫🇷</Text>
                  </View>

                  <Text style={styles.cardFrenchText}>{currentCard.french}</Text>

                  <View style={styles.audioActionRow}>
                    <AudioButton text={currentCard.french} size={28} color="#2563EB" />
                    <TouchableOpacity
                      style={styles.slowPill}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        speechService.speak(currentCard.french, 0.65);
                      }}
                    >
                      <Text style={styles.slowPillText}>نطق بطيء 🐢</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tapToFlipHint}>
                    <Ionicons name="sync" size={16} color="#94A3B8" />
                    <Text style={styles.tapToFlipText}>اضغط على البطاقة لقلبها ومعرفة المعنى</Text>
                  </View>
                </View>
              ) : (
                /* Back Side (Arabic & Example) */
                <View style={styles.cardContent}>
                  <View style={styles.flagIconRow}>
                    <Text style={styles.sideLabel}>المعنى العربي والنطق 🇸🇦</Text>
                  </View>

                  <Text style={styles.cardArabicText}>{currentCard.arabic}</Text>
                  <Text style={styles.cardPhoneticText}>[{currentCard.phonetics}]</Text>

                  {/* Sentence Example */}
                  <View style={styles.exampleSentenceBox}>
                    <View style={styles.exampleSentenceHeader}>
                      <Text style={styles.exampleSentenceLabel}>مثال في جملة:</Text>
                      <AudioButton text={currentCard.exampleFr} size={16} color="#1D4ED8" />
                    </View>
                    <Text style={styles.exampleSentenceFr}>{currentCard.exampleFr}</Text>
                    <Text style={styles.exampleSentenceAr}>{currentCard.exampleAr}</Text>
                  </View>

                  <View style={styles.tapToFlipHint}>
                    <Ionicons name="sync" size={16} color="#94A3B8" />
                    <Text style={styles.tapToFlipText}>اضغط للعودة إلى الوجه الفرنسي</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Bottom Controls */}
            <View style={styles.cardControlsRow}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevCard}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#334155" />
                <Text style={styles.navButtonText}>السابق</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.masteredButton}
                onPress={() => handleMarkMastered(currentCard.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.masteredButtonText}>أعرفها تماماً</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNextCard}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>التالي</Text>
                <Ionicons name="arrow-forward" size={20} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>لا توجد كلمات مطابقة</Text>
            <Text style={styles.emptySubtitle}>جرب تغيير الفئة أو البحث عن كلمة أخرى</Text>
          </View>
        )
      ) : (
        /* Mode 2: Searchable Vocabulary Dictionary List */
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isFav = stats.favoriteCards.includes(item.id);
            return (
              <View style={styles.dictionaryItem}>
                <View style={styles.dictMainRow}>
                  <View style={styles.dictLeftText}>
                    <Text style={styles.dictFrench}>{item.french}</Text>
                    <Text style={styles.dictPhonetic}>[{item.phonetics}]</Text>
                    <Text style={styles.dictArabic}>{item.arabic}</Text>
                  </View>

                  <View style={styles.dictActions}>
                    <AudioButton text={item.french} size={20} color="#2563EB" />
                    <TouchableOpacity
                      onPress={() => onToggleFavorite(item.id)}
                      style={styles.dictFavBtn}
                    >
                      <Ionicons
                        name={isFav ? 'star' : 'star-outline'}
                        size={20}
                        color={isFav ? '#F59E0B' : '#CBD5E1'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {item.exampleFr && (
                  <View style={styles.dictExampleRow}>
                    <Text style={styles.dictExampleFr}>"{item.exampleFr}"</Text>
                    <Text style={styles.dictExampleAr}>{item.exampleAr}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'right',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  cardViewContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 6,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  mainFlashcard: {
    flex: 1,
    marginVertical: 14,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  cardBack: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flagIconRow: {
    marginBottom: 16,
  },
  sideLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  cardFrenchText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardArabicText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  cardPhoneticText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 6,
    marginBottom: 16,
  },
  audioActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  slowPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  slowPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  exampleSentenceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  exampleSentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exampleSentenceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  exampleSentenceFr: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  exampleSentenceAr: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    textAlign: 'right',
  },
  tapToFlipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  tapToFlipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  masteredButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  masteredButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  dictionaryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dictMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dictLeftText: {
    flex: 1,
  },
  dictFrench: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  dictPhonetic: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 1,
  },
  dictArabic: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginTop: 3,
  },
  dictActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dictFavBtn: {
    padding: 6,
  },
  dictExampleRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  dictExampleFr: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  dictExampleAr: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
});
