import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface EmptyStateProps {
  type: 'search' | 'saved';
}

export default function EmptyState({ type }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {type === 'search' ? (
        <Search size={48} color={colors.dark.textSecondary} />
      ) : (
        <Calendar size={48} color={colors.dark.textSecondary} />
      )}
      
      <Text style={styles.title}>
        {type === 'search' ? 'No events found' : 'No saved events'}
      </Text>
      
      <Text style={styles.description}>
        {type === 'search' 
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'Events you save will appear here for easy access.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
});