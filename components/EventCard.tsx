import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { Event } from '@/types/event';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';
import CategoryPill from './CategoryPill';
import { formatEventDate } from '@/utils/dateUtils';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
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
    <Pressable 
      style={[styles.container, featured && styles.featuredContainer]} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: event.imageUrl }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
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
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={16} color={colors.dark.textSecondary} />
            <Text style={styles.metaText}>{formatEventDate(event.startDate)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            {event.location.type === 'online' ? (
              <Users size={16} color={colors.dark.textSecondary} />
            ) : (
              <MapPin size={16} color={colors.dark.textSecondary} />
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
          {event.categories.length > 2 && (
            <Text style={styles.moreCategories}>+{event.categories.length - 2}</Text>
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.organizerContainer}>
            <Image 
              source={{ uri: event.organizer.avatar }} 
              style={styles.organizerAvatar} 
            />
            <Text style={styles.organizerName}>{event.organizer.name}</Text>
          </View>
          
          <View style={styles.attendeesContainer}>
            <Users size={14} color={colors.dark.textSecondary} />
            <Text style={styles.attendeesText}>
              {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  imageContainer: {
    height: 160,
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
    height: 80,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginLeft: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  moreCategories: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginLeft: 8,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  organizerName: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginLeft: 6,
  },
});