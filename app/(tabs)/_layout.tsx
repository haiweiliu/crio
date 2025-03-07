import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Bookmark, User, BarChart } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.dark.background,
          borderTopColor: colors.dark.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.dark.textSecondary,
        headerStyle: {
          backgroundColor: colors.dark.background,
        },
        headerTitleStyle: {
          color: colors.dark.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}