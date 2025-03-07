import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { EventCategory } from '@/types/event';
import { categories } from '@/mocks/categories';
import { colors } from '@/constants/colors';
import { Code, Image, Users, TrendingUp, MessageCircle, Gamepad2, MoreHorizontal, Building, Network, Brain } from 'lucide-react-native';

interface CategoryPillProps {
  category: EventCategory;
  onPress?: () => void;
  selected?: boolean;
  small?: boolean;
}

export default function CategoryPill({ 
  category, 
  onPress, 
  selected = false,
  small = false
}: CategoryPillProps) {
  const categoryInfo = categories.find(c => c.id === category);
  
  if (!categoryInfo) return null;
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'defi':
        return <TrendingUp size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'rwa':
        return <Building size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'depin':
        return <Network size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'ai':
        return <Brain size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'gaming':
        return <Gamepad2 size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'social':
        return <MessageCircle size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      case 'dev':
        return <Code size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
      default:
        return <MoreHorizontal size={small ? 12 : 16} color={selected ? 'white' : categoryInfo.color} />;
    }
  };
  
  const Container = onPress ? Pressable : View;
  
  return (
    <Container 
      style={[
        styles.container, 
        small && styles.smallContainer,
        selected && { backgroundColor: categoryInfo.color }
      ]}
      onPress={onPress}
    >
      {getCategoryIcon()}
      <Text 
        style={[
          styles.text, 
          small && styles.smallText,
          selected && styles.selectedText
        ]}
      >
        {categoryInfo.name}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  smallText: {
    fontSize: 12,
  },
  selectedText: {
    color: 'white',
  }
});