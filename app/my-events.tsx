import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, FlatList, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { Event } from '@/types/event';

export default function MyEventsScreen() {
  const router = useRouter();
  const { getRegisteredEvents } = useEventStore();
  const registeredEvents = getRegisteredEvents();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const now = new Date();
  
  const upcomingEvents = registeredEvents.filter(
    event => new Date(event.startDate) > now
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const pastEvents = registeredEvents.filter(
    event => new Date(event.startDate) <= now
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  const renderItem = ({ item }: { item: Event }) => (
    <EventCard event={item} />
  );
  
  const renderEmptyList = () => (
    <EmptyState type="saved" />
  );
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "My Events",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.tabContainer}>
          <Pressable 
            style={[
              styles.tab, 
              activeTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'upcoming' && styles.activeTabText
              ]}
            >
              Upcoming
            </Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.tab, 
              activeTab === 'past' && styles.activeTab
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'past' && styles.activeTabText
              ]}
            >
              Past
            </Text>
          </Pressable>
        </View>
        
        <FlatList
          data={activeTab === 'upcoming' ? upcomingEvents : pastEvents}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming events" 
                  : "You haven't attended any events yet"}
              </Text>
              <Pressable 
                style={styles.browseButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.browseButtonText}>Browse Events</Text>
              </Pressable>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});