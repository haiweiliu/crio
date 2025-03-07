import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, StatusBar, Text, View, Pressable } from 'react-native';
import { useEventStore } from '@/store/eventStore';
import { colors } from '@/constants/colors';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { Event } from '@/types/event';
import { Bookmark, Calendar } from 'lucide-react-native';

export default function SavedScreen() {
  const { getSavedEvents, getRegisteredEvents } = useEventStore();
  const savedEvents = getSavedEvents();
  const registeredEvents = getRegisteredEvents();
  
  const [activeTab, setActiveTab] = useState<'saved' | 'registered'>('saved');
  
  const renderItem = ({ item }: { item: Event }) => (
    <EventCard event={item} />
  );
  
  const renderEmptyList = () => (
    <EmptyState type="saved" />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'saved' ? 'Saved Events' : 'Registered Events'}
        </Text>
        <Text style={styles.subtitle}>
          {activeTab === 'saved' 
            ? `${savedEvents.length} ${savedEvents.length === 1 ? 'event' : 'events'}`
            : `${registeredEvents.length} ${registeredEvents.length === 1 ? 'event' : 'events'}`}
        </Text>
      </View>
      
      <View style={styles.tabContainer}>
        <Pressable 
          style={[
            styles.tab, 
            activeTab === 'saved' && styles.activeTab
          ]}
          onPress={() => setActiveTab('saved')}
        >
          <Bookmark size={18} color={activeTab === 'saved' ? colors.primary : colors.dark.textSecondary} />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'saved' && styles.activeTabText
            ]}
          >
            Saved
          </Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.tab, 
            activeTab === 'registered' && styles.activeTab
          ]}
          onPress={() => setActiveTab('registered')}
        >
          <Calendar size={18} color={activeTab === 'registered' ? colors.primary : colors.dark.textSecondary} />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'registered' && styles.activeTabText
            ]}
          >
            Registered
          </Text>
        </Pressable>
      </View>
      
      <FlatList
        data={activeTab === 'saved' ? savedEvents : registeredEvents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
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
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(138, 111, 232, 0.1)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});