import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView, Pressable, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Crown, Check, ArrowLeft, Tag, Calendar, Star, Clock, Gift, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function VipBenefitsScreen() {
  const router = useRouter();
  const { profile, cancelVip, upgradeToVip } = useUserStore();
  
  const benefits = [
    {
      icon: <Tag size={24} color={colors.primary} />,
      title: '15% Discount on All Events',
      description: 'Save on registration fees for all paid events'
    },
    {
      icon: <Clock size={24} color={colors.primary} />,
      title: 'Early Access',
      description: 'Register for popular events before they sell out'
    },
    {
      icon: <Calendar size={24} color={colors.primary} />,
      title: 'Exclusive VIP Events',
      description: 'Access to members-only networking events'
    },
    {
      icon: <Star size={24} color={colors.primary} />,
      title: 'Priority Support',
      description: 'Get help faster when you need assistance'
    },
    {
      icon: <Gift size={24} color={colors.primary} />,
      title: 'Special Perks',
      description: 'Surprise gifts and special offers from partners'
    }
  ];
  
  const handleCancelVip = () => {
    Alert.alert(
      "Cancel VIP Membership",
      "Are you sure you want to cancel your VIP membership? You'll lose all benefits at the end of your billing period.",
      [
        {
          text: "Keep VIP",
          style: "cancel"
        },
        { 
          text: "Cancel Membership", 
          onPress: () => {
            cancelVip();
            Alert.alert(
              "Membership Cancelled",
              "Your VIP membership has been cancelled. You'll continue to enjoy benefits until the end of your current billing period.",
              [{ text: "OK" }]
            );
            router.replace('/(tabs)/analytics-locked');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleUpgradeVip = () => {
    Alert.alert(
      "Upgrade to VIP",
      "Enjoy premium benefits for $30/month including event discounts, priority registration, and exclusive events.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Upgrade Now", 
          onPress: () => {
            upgradeToVip();
            Alert.alert(
              "Welcome to VIP!",
              "You've successfully upgraded to VIP status. Enjoy your benefits!",
              [{ 
                text: "OK",
                onPress: () => {
                  // Navigate to analytics tab and reset navigation state
                  router.replace('/(tabs)/analytics');
                }
              }]
            );
          }
        }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "VIP Benefits",
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#8A6FE8', '#5EEAD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Crown size={48} color="#FFD700" />
            <Text style={styles.headerTitle}>VIP Membership</Text>
            <Text style={styles.headerSubtitle}>
              {profile.isVip 
                ? 'You\'re enjoying premium benefits' 
                : 'Upgrade for exclusive perks'}
            </Text>
            
            {profile.isVip && profile.vipExpiryDate && (
              <View style={styles.expiryContainer}>
                <Shield size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.expiryText}>
                  Active until {new Date(profile.vipExpiryDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </LinearGradient>
          
          <View style={styles.benefitsContainer}>
            <Text style={styles.sectionTitle}>Membership Benefits</Text>
            
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  {benefit.icon}
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
                <Check size={20} color={colors.success} />
              </View>
            ))}
          </View>
          
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingTitle}>VIP Membership</Text>
            <Text style={styles.price}>$30<Text style={styles.perMonth}>/month</Text></Text>
            <Text style={styles.pricingDescription}>
              Cancel anytime. No long-term commitment required.
            </Text>
          </View>
          
          {profile.isVip ? (
            <Pressable 
              style={styles.cancelButton}
              onPress={handleCancelVip}
            >
              <Text style={styles.cancelButtonText}>Cancel Membership</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={styles.upgradeButton}
              onPress={handleUpgradeVip}
            >
              <Crown size={20} color="white" style={styles.upgradeIcon} />
              <Text style={styles.upgradeButtonText}>Upgrade to VIP</Text>
            </Pressable>
          )}
          
          <View style={styles.testimonialContainer}>
            <Text style={styles.testimonialTitle}>What Members Say</Text>
            
            <View style={styles.testimonialCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' }} 
                style={styles.testimonialAvatar} 
              />
              <Text style={styles.testimonialText}>
                "The VIP membership has paid for itself with the event discounts alone. Plus, the exclusive events are amazing for networking!"
              </Text>
              <Text style={styles.testimonialName}>- Michael Chen, Developer</Text>
            </View>
            
            <View style={styles.testimonialCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' }} 
                style={styles.testimonialAvatar} 
              />
              <Text style={styles.testimonialText}>
                "Early access to popular events has been a game-changer. I never miss the important conferences now."
              </Text>
              <Text style={styles.testimonialName}>- Emma Rodriguez, Founder</Text>
            </View>
          </View>
          
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How does the 15% discount work?</Text>
              <Text style={styles.faqAnswer}>
                The discount is automatically applied to all paid events when you're logged in with your VIP account.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
              <Text style={styles.faqAnswer}>
                Yes, you can cancel your membership at any time. You'll continue to enjoy benefits until the end of your current billing period.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I access exclusive events?</Text>
              <Text style={styles.faqAnswer}>
                VIP-only events will be visible in your feed with a special VIP badge. You'll also receive email notifications.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  expiryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 6,
  },
  benefitsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(138, 111, 232, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  pricingContainer: {
    backgroundColor: colors.dark.card,
    margin: 24,
    marginTop: 0,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 12,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  perMonth: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.dark.textSecondary,
  },
  pricingDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  cancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  testimonialContainer: {
    padding: 24,
    paddingTop: 0,
  },
  testimonialTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 14,
    color: colors.dark.text,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  testimonialName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
  faqContainer: {
    padding: 24,
    paddingTop: 0,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
});