import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, SafeAreaView, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { colors } from '@/constants/colors';
import EventCard from '@/components/EventCard';
import FeaturedEventCard from '@/components/FeaturedEventCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import { Event } from '@/types/event';
import { Calendar, TrendingUp, DollarSign, Plus } from 'lucide-react-native';

export default function DiscoverScreen() {
  const router = useRouter();
  const { getFilteredEvents, setSortBy, sortBy, searchQuery, selectedCategories } = useEventStore();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [regularEvents, setRegularEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    const events = getFilteredEvents();
    setFeaturedEvents(events.filter(event => event.isFeatured));
    setRegularEvents(events.filter(event => !event.isFeatured));
  }, [getFilteredEvents, searchQuery, selectedCategories, sortBy]);
  
  const renderFeaturedEvents = () => {
    if (featuredEvents.length === 0) return null;
    
    return (
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Events</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScrollContent}
        >
          {featuredEvents.map(event => (
            <FeaturedEventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const renderItem = ({ item }: { item: Event }) => (
    <EventCard event={item} />
  );
  
  const renderEmptyList = () => (
    <EmptyState type="search" />
  );
  
  const handleCreateEvent = () => {
    router.push('/create-event');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <SearchBar />
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            <Pressable 
              style={[
                styles.sortButton,
                sortBy === 'date' && styles.activeSortButton
              ]}
              onPress={() => setSortBy('date')}
            >
              <Calendar size={16} color={sortBy === 'date' ? 'white' : colors.dark.textSecondary} />
              <Text 
                style={[
                  styles.sortButtonText,
                  sortBy === 'date' && styles.activeSortButtonText
                ]}
              >
                Date
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.sortButton,
                sortBy === 'popularity' && styles.activeSortButton
              ]}
              onPress={() => setSortBy('popularity')}
            >
              <TrendingUp size={16} color={sortBy === 'popularity' ? 'white' : colors.dark.textSecondary} />
              <Text 
                style={[
                  styles.sortButtonText,
                  sortBy === 'popularity' && styles.activeSortButtonText
                ]}
              >
                Popular
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.sortButton,
                sortBy === 'price' && styles.activeSortButton
              ]}
              onPress={() => setSortBy('price')}
            >
              <DollarSign size={16} color={sortBy === 'price' ? 'white' : colors.dark.textSecondary} />
              <Text 
                style={[
                  styles.sortButtonText,
                  sortBy === 'price' && styles.activeSortButtonText
                ]}
              >
                Price
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      
      <CategoryFilter />
      
      {featuredEvents.length > 0 || regularEvents.length > 0 ? (
        <FlatList
          data={regularEvents}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderFeaturedEvents}
          ListEmptyComponent={renderEmptyList}
        />
      ) : (
        <EmptyState type="search" />
      )}
      
      <Pressable 
        style={styles.createEventButton}
        onPress={handleCreateEvent}
      >
        <Plus size={20} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sortLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginLeft: 4,
  },
  activeSortButtonText: {
    color: 'white',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featuredScrollContent: {
    paddingLeft: 16,
    paddingRight: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  createEventButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});