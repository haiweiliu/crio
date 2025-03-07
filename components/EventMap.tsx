import React from 'react';
import { StyleSheet, View, Text, Pressable, Linking, Platform } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface EventMapProps {
  address: string;
  city?: string;
  country?: string;
}

export default function EventMap({ address, city, country }: EventMapProps) {
  const fullAddress = `${address}${city ? `, ${city}` : ''}${country ? `, ${country}` : ''}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  
  const openMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
      web: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    });
    
    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>
        <View style={styles.pinContainer}>
          <MapPin size={32} color={colors.primary} />
          <View style={styles.pinShadow} />
        </View>
      </View>
      
      <View style={styles.addressContainer}>
        <View style={styles.addressContent}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.addressText} numberOfLines={2}>{fullAddress}</Text>
        </View>
        <Pressable style={styles.directionsButton} onPress={openMaps}>
          <Navigation size={16} color="white" />
          <Text style={styles.directionsText}>Get Directions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
    marginBottom: 16,
  },
  mapPreview: {
    height: 180,
    width: '100%',
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  pinContainer: {
    alignItems: 'center',
  },
  pinShadow: {
    width: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    transform: [{ scaleX: 2 }],
    marginTop: -4,
  },
  addressContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  addressText: {
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 8,
    flex: 1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  directionsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});