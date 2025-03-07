import React from 'react';
import { StyleSheet, View, Text, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { Event } from '@/types/event';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';
import CategoryPill from './CategoryPill';
import { formatEventDate } from '@/utils/dateUtils';

interface FeaturedEventCardProps {
  event: Event;
}

const { width } = Dimensions.get('window');

export default function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const router = useRouter();
  const { isSaved, toggleSaveEvent } = useEventStore();
  const saved = isSaved(event.id);
  
  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };
  
  const handleSave = (e: any) => {
    e.stopPropagation();
    toggleSaveEvent(event.id);
  };
  
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image 
        source={{ uri: event.imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
          
          <Pressable 
            style={styles.bookmarkButton} 
            onPress={handleSave}
            hitSlop={10}
          >
            {saved ? (
              <BookmarkCheck size={24} color={colors.primary} />
            ) : (
              <Bookmark size={24} color="white" />
            )}
          </Pressable>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{formatEventDate(event.startDate)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              {event.location.type === 'online' ? (
                <Users size={16} color="rgba(255,255,255,0.8)" />
              ) : (
                <MapPin size={16} color="rgba(255,255,255,0.8)" />
              )}
              <Text style={styles.metaText}>
                {event.location.type === 'online' 
                  ? 'Online' 
                  : event.location.city || 'In-person'}
              </Text>
            </View>
          </View>
          
          <View style={styles.categoryContainer}>
            {event.categories.slice(0, 2).map((category) => (
              <CategoryPill key={category} category={category} small />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: width - 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  footer: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  metaContainer: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
});