import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { subscribeToArticles } from '../services/firestoreService';
import PrimaryButton from '../components/PrimaryButton';
import { articleIconName } from '../components/articleIcon';
import { COLORS } from '../theme/palette';

const BASE_CATEGORIES = ['Todos', 'Herramientas', 'Dispositivos', 'Cables'];

export default function ArticulosScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const unsubscribe = subscribeToArticles((articlesData) => {
      setArticles(articlesData);
      setFilteredArticles(articlesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter((article) =>
        article.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((article) => article.categoria === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, articles]);

  const categories = articles.some((a) => a.categoria === 'Redes')
    ? [...BASE_CATEGORIES, 'Redes']
    : BASE_CATEGORIES;

  const sectionTitle =
    selectedCategory === 'Todos' ? 'Todos los artículos' : selectedCategory;
  const count = filteredArticles.length;

  const renderArticle = (article) => {
    const out = !article.stock;
    const availability = out ? 'Agotado' : `${article.stock} disponibles`;

    return (
      <View key={article.id} style={styles.articleCard}>
        <View style={styles.articleRow}>
          <View style={styles.articleThumb}>
            <MaterialCommunityIcons
              name={articleIconName(article.categoria)}
              size={30}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.articleInfo}>
            <Text style={styles.articleCategory}>{article.categoria}</Text>
            <Text style={styles.articleName}>{article.nombre}</Text>
            <View style={styles.availabilityRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: out ? COLORS.error : COLORS.primary },
                ]}
              />
              <Text
                style={[
                  styles.availabilityText,
                  out && { color: COLORS.error },
                ]}
              >
                {availability}
              </Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          label={out ? 'Agotado' : 'Solicitar préstamo'}
          icon="plus"
          size="sm"
          disabled={out}
          onPress={() => navigation.navigate('LoanRequest', { article })}
          style={styles.solicitButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Artículos</Text>
        <Text style={styles.subtitle}>Encuentra el equipo para tu proyecto.</Text>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color={COLORS.textSoft} />
          <TextInput
            placeholder="Buscar por nombre de artículo"
            placeholderTextColor="#7E8A81"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={COLORS.textSoft}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <Text style={styles.sectionMeta}>
            {count} {count === 1 ? 'artículo' : 'artículos'}
          </Text>
        </View>

        {filteredArticles.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="package-variant"
              size={44}
              color={COLORS.textSoft}
            />
            <Text style={styles.emptyText}>No se encontraron artículos</Text>
          </View>
        ) : (
          filteredArticles.map(renderArticle)
        )}

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            Elige un artículo y solicita su préstamo. Revisa tus devoluciones desde
            Inicio.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    fontSize: 34,
    color: COLORS.text,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.text,
    padding: 0,
  },
  chipsRow: {
    gap: 10,
    paddingBottom: 4,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
  },
  chipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.onPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.text,
  },
  sectionMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSoft,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 10,
  },
  articleCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  articleThumb: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: COLORS.greenSoftStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleInfo: {
    flex: 1,
  },
  articleCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSoft,
    marginBottom: 3,
  },
  articleName: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  availabilityText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  solicitButton: {
    width: '100%',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.greenSoft,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
  },
  bottomSpacing: {
    height: 110,
  },
});
