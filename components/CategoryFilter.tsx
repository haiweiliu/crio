import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable } from 'react-native';
import { categories } from '@/mocks/categories';
import { EventCategory } from '@/types/event';
import CategoryPill from './CategoryPill';
import { useEventStore } from '@/store/eventStore';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function CategoryFilter() {
  const { selectedCategories, toggleCategory, setSelectedCategories } = useEventStore();
  
  const clearFilters = () => {
    setSelectedCategories([]);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        {selectedCategories.length > 0 && (
          <Pressable onPress={clearFilters} style={styles.clearButton}>
            <X size={14} color={colors.dark.textSecondary} />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryPill 
            key={category.id}
            category={category.id as EventCategory}
            onPress={() => toggleCategory(category.id as EventCategory)}
            selected={selectedCategories.includes(category.id as EventCategory)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});