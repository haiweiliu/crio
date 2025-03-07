import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Pressable, SafeAreaView, StatusBar, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck, ArrowLeft, Share2, ExternalLink, Crown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';
import { useUserStore } from '@/store/userStore';
import CategoryPill from '@/components/CategoryPill';
import { formatFullEventDate } from '@/utils/dateUtils';
import EventMap from '@/components/EventMap';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEventById, isSaved, toggleSaveEvent, registerForEvent, isRegistered } = useEventStore();
  const { profile, getEventDiscount } = useUserStore();
  
  const event = getEventById(id);
  const saved = isSaved(id);
  const registered = event?.isRegistered || isRegistered(id);
  
  const [isRegistering, setIsRegistering] = useState(false);
  
  if (!event) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Event not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  
  const handleSave = () => {
    toggleSaveEvent(id);
  };
  
  const handleShare = async () => {
    // In a real app, this would use the Share API
    console.log('Sharing event:', event.title);
  };
  
  const handleRegister = () => {
    if (registered) {
      router.push('/my-events');
      return;
    }
    
    setIsRegistering(true);
    
    // Simulate registration process
    setTimeout(() => {
      registerForEvent(id);
      setIsRegistering(false);
      
      Alert.alert(
        "Registration Successful",
        "You've successfully registered for this event!",
        [
          { 
            text: "View My Events", 
            onPress: () => router.push('/my-events')
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    }, 1500);
  };
  
  const openMap = () => {
    if (event.location.type === 'online') return;
    
    const address = `${event.location.address}, ${event.location.city}, ${event.location.country}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
      web: `https://maps.google.com/?q=${address}`
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };
  
  // Calculate price with VIP discount if applicable
  const originalPrice = event.price?.amount || 0;
  const discount = profile.isVip ? getEventDiscount(originalPrice) : 0;
  const finalPrice = originalPrice - discount;
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: event.imageUrl }} 
              style={styles.image} 
              resizeMode="cover" 
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent']}
              style={styles.topGradient}
            />
            
            <View style={styles.headerButtons}>
              <Pressable 
                style={styles.iconButton} 
                onPress={() => router.back()}
                hitSlop={10}
              >
                <ArrowLeft size={24} color="white" />
              </Pressable>
              
              <View style={styles.rightButtons}>
                <Pressable 
                  style={styles.iconButton} 
                  onPress={handleShare}
                  hitSlop={10}
                >
                  <Share2 size={24} color="white" />
                </Pressable>
                
                <Pressable 
                  style={styles.iconButton} 
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
            </View>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>{event.title}</Text>
            
            <View style={styles.organizerContainer}>
              <Image 
                source={{ uri: event.organizer.avatar }} 
                style={styles.organizerAvatar} 
              />
              <Text style={styles.organizerName}>By {event.organizer.name}</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Calendar size={20} color={colors.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Date & Time</Text>
                  <Text style={styles.infoValue}>
                    {formatFullEventDate(event.startDate, event.endDate)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                {event.location.type === 'online' ? (
                  <ExternalLink size={20} color={colors.primary} />
                ) : (
                  <MapPin size={20} color={colors.primary} />
                )}
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>
                    {event.location.type === 'online' ? 'Online Event' : 'Location'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {event.location.type === 'online' 
                      ? 'Join via link provided after registration' 
                      : `${event.location.address}, ${event.location.city}`}
                  </Text>
                  {event.location.type !== 'online' && (
                    <Pressable onPress={openMap}>
                      <Text style={styles.viewMapText}>View on map</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
            
            {event.location.type !== 'online' && event.location.address && (
              <EventMap 
                address={event.location.address} 
                city={event.location.city} 
                country={event.location.country} 
              />
            )}
            
            <View style={styles.categoryContainer}>
              {event.categories.map((category) => (
                <CategoryPill key={category} category={category} />
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
            
            {event.speakers && event.speakers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Speakers</Text>
                {event.speakers.map((speaker) => (
                  <View key={speaker.id} style={styles.speakerItem}>
                    <Image 
                      source={{ uri: speaker.avatar }} 
                      style={styles.speakerAvatar} 
                    />
                    <View style={styles.speakerInfo}>
                      <Text style={styles.speakerName}>{speaker.name}</Text>
                      {speaker.title && speaker.company && (
                        <Text style={styles.speakerTitle}>
                          {speaker.title}, {speaker.company}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.attendeeSection}>
              <View style={styles.attendeeHeader}>
                <Text style={styles.sectionTitle}>Attendees</Text>
                <Text style={styles.attendeeCount}>
                  {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
                </Text>
              </View>
              
              <View style={styles.attendeeBar}>
                <View 
                  style={[
                    styles.attendeeProgress, 
                    { 
                      width: event.maxAttendees 
                        ? `${Math.min(100, (event.attendees / event.maxAttendees) * 100)}%` 
                        : '100%' 
                    }
                  ]} 
                />
              </View>
              
              {event.maxAttendees && event.attendees >= event.maxAttendees && (
                <Text style={styles.soldOutText}>Sold Out</Text>
              )}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          {event.price ? (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              {profile.isVip && discount > 0 ? (
                <View>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>${originalPrice}</Text>
                    <View style={styles.vipBadge}>
                      <Crown size={12} color="#FFD700" />
                      <Text style={styles.vipText}>VIP</Text>
                    </View>
                  </View>
                  <Text style={styles.priceValue}>${finalPrice.toFixed(2)}</Text>
                </View>
              ) : (
                <Text style={styles.priceValue}>
                  {event.price.amount === 0 
                    ? 'Free' 
                    : `$${event.price.amount}`}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>Free</Text>
            </View>
          )}
          
          <Pressable 
            style={[
              styles.registerButton,
              registered && styles.registeredButton,
              isRegistering && styles.registeringButton,
              event.maxAttendees && event.attendees >= event.maxAttendees && styles.disabledButton
            ]}
            onPress={handleRegister}
            disabled={isRegistering || (event.maxAttendees && event.attendees >= event.maxAttendees)}
          >
            <Text style={styles.registerButtonText}>
              {isRegistering 
                ? 'Registering...' 
                : registered 
                  ? 'Registered' 
                  : event.maxAttendees && event.attendees >= event.maxAttendees 
                    ? 'Sold Out' 
                    : 'Register'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.dark.text,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 12,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  organizerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  organizerName: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.dark.text,
  },
  viewMapText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark.textSecondary,
  },
  speakerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  speakerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  speakerTitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  attendeeSection: {
    marginBottom: 24,
  },
  attendeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendeeCount: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },
  attendeeBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  attendeeProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  soldOutText: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 8,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.card,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registeredButton: {
    backgroundColor: colors.success,
  },
  registeringButton: {
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});