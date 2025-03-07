import React from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useEventStore();
  
  const handleClear = () => {
    setSearchQuery('');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.dark.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search events, organizers..."
          placeholderTextColor={colors.dark.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={10}>
            <X size={20} color={colors.dark.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
    padding: 0,
  },
});