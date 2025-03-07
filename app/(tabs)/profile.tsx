import React from 'react';
import { StyleSheet, View, Text, Image, Pressable, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Wallet, Calendar, Bell, ChevronRight, LogOut, Crown, Plus, Edit } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useEventStore } from '@/store/eventStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, upgradeToVip } = useUserStore();
  const { getRegisteredEvents } = useEventStore();
  
  const registeredEvents = getRegisteredEvents();
  const upcomingEvents = registeredEvents.filter(
    event => new Date(event.startDate) > new Date()
  ).length;
  
  const handleVipUpgrade = () => {
    if (profile.isVip) {
      router.push('/vip-benefits');
    } else {
      Alert.alert(
        "Upgrade to VIP",
        "Enjoy premium benefits for $30/month including event discounts, priority registration, exclusive events, and analytics access.",
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
                [
                  { 
                    text: "View Benefits", 
                    onPress: () => router.push('/vip-benefits')
                  },
                  {
                    text: "OK",
                    style: "cancel"
                  }
                ]
              );
            }
          }
        ]
      );
    }
  };
  
  const handleCreateEvent = () => {
    router.push('/create-event');
  };
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const menuItems = [
    {
      icon: <Settings size={22} color={colors.dark.text} />,
      title: 'Settings',
      onPress: () => {},
    },
    {
      icon: <Wallet size={22} color={colors.dark.text} />,
      title: 'Payment Methods',
      onPress: () => {},
    },
    {
      icon: <Calendar size={22} color={colors.dark.text} />,
      title: 'My Events',
      onPress: () => router.push('/my-events'),
    },
    {
      icon: <Bell size={22} color={colors.dark.text} />,
      title: 'Notifications',
      onPress: () => {},
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: profile.avatar }} 
                style={styles.avatar} 
              />
              <Pressable 
                style={styles.editAvatarButton}
                onPress={handleEditProfile}
              >
                <Edit size={16} color="white" />
              </Pressable>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.email}>{profile.email}</Text>
              
              {profile.isVip && (
                <View style={styles.vipBadge}>
                  <Crown size={14} color="#FFD700" />
                  <Text style={styles.vipText}>VIP Member</Text>
                </View>
              )}
            </View>
          </View>
          
          <Pressable 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>
        
        {!profile.isVip && (
          <Pressable style={styles.vipBanner} onPress={handleVipUpgrade}>
            <LinearGradient
              colors={['#8A6FE8', '#5EEAD4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vipGradient}
            >
              <View style={styles.vipContent}>
                <Crown size={24} color="#FFD700" />
                <View style={styles.vipTextContainer}>
                  <Text style={styles.vipTitle}>Upgrade to VIP</Text>
                  <Text style={styles.vipDescription}>Get 15% off events, priority access & analytics</Text>
                </View>
                <ChevronRight size={20} color="white" />
              </View>
            </LinearGradient>
          </Pressable>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.eventsAttended}</Text>
            <Text style={styles.statLabel}>Events Attended</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{upcomingEvents}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.eventsOrganized}</Text>
            <Text style={styles.statLabel}>Organized</Text>
          </View>
        </View>
        
        <Pressable 
          style={styles.createEventButton}
          onPress={handleCreateEvent}
        >
          <Plus size={20} color="white" />
          <Text style={styles.createEventText}>Create New Event</Text>
        </Pressable>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={colors.dark.textSecondary} />
            </Pressable>
          ))}
        </View>
        
        {profile.isVip && (
          <Pressable 
            style={styles.vipBenefitsButton}
            onPress={() => router.push('/vip-benefits')}
          >
            <Crown size={20} color="#FFD700" />
            <Text style={styles.vipBenefitsText}>View VIP Benefits</Text>
          </Pressable>
        )}
        
        <Pressable style={styles.logoutButton}>
          <LogOut size={20} color={colors.accent} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        
        <Text style={styles.versionText}>Crio v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.background,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  vipText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  vipBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  vipGradient: {
    borderRadius: 12,
  },
  vipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  vipTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  vipTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  vipDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.dark.border,
    marginHorizontal: 8,
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createEventText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.dark.text,
    marginLeft: 12,
  },
  vipBenefitsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
  },
  vipBenefitsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFD700',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.accent,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 30,
  },
});