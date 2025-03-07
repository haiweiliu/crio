import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Crown, BarChart, Tag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnalyticsLockedScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const [showFireworks, setShowFireworks] = useState(false);
  
  const fireworksAnim = useRef(new Array(5).fill(0).map(() => ({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    position: new Animated.ValueXY({ x: 0, y: 0 })
  }))).current;
  
  useEffect(() => {
    if (profile.isVip) {
      router.replace('/(tabs)/analytics');
    }
  }, [profile.isVip, router]);
  
  const animateFirework = (index: number) => {
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 300 - 150;

    fireworksAnim[index].position.setValue({ x: 0, y: 0 });
    fireworksAnim[index].scale.setValue(0);
    fireworksAnim[index].opacity.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(fireworksAnim[index].position, {
          toValue: { x: randomX, y: randomY },
          useNativeDriver: true,
          speed: 2,
          bounciness: 8
        }),
      ]),
      Animated.sequence([
        Animated.spring(fireworksAnim[index].scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 2,
        }),
        Animated.timing(fireworksAnim[index].scale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]),
      Animated.sequence([
        Animated.timing(fireworksAnim[index].opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          delay: 500
        })
      ])
    ]).start();
  };
  
  const handleUpgrade = () => {
    setShowFireworks(true);
    fireworksAnim.forEach((_, index) => {
      setTimeout(() => animateFirework(index), index * 200);
    });
    setTimeout(() => {
      setShowFireworks(false);
      router.push('/vip-benefits');
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {showFireworks && fireworksAnim.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.firework,
              {
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.position.x },
                  { translateY: anim.position.y },
                  { scale: anim.scale }
                ]
              }
            ]}
          />
        ))}
        
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['rgba(138, 111, 232, 0.2)', 'rgba(94, 234, 212, 0.2)']}
            style={styles.iconBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Crown size={64} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>VIP Features</Text>
        
        <Text style={styles.description}>
          Upgrade to VIP to access premium features and exclusive benefits.
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Tag size={24} color={colors.primary} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>15% Event Discount</Text>
              <Text style={styles.featureDescription}>Save on all paid event registrations</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <BarChart size={24} color={colors.primary} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Event Analytics</Text>
              <Text style={styles.featureDescription}>Track trends and insights about the web3 event landscape</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Crown size={24} color={colors.secondary} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Industry Insights</Text>
              <Text style={styles.featureDescription}>Get data-driven insights about the web3 event landscape</Text>
            </View>
          </View>
        </View>
        
        <Pressable 
          style={styles.upgradeButton}
          onPress={handleUpgrade}
        >
          <Crown size={20} color="white" style={styles.upgradeIcon} />
          <Text style={styles.upgradeButtonText}>Upgrade to VIP</Text>
        </Pressable>
        
        <Text style={styles.pricingText}>
          Just $30/month - Cancel anytime
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 16,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  upgradeIcon: {
    marginRight: 8,
  },
  pricingText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  firework: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});