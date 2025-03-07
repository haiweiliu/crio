import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, StatusBar, ScrollView, Switch, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Users, Image as ImageIcon, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { categories } from '@/mocks/categories';
import { EventCategory } from '@/types/event';
import CategoryPill from '@/components/CategoryPill';
import { useEventStore } from '@/store/eventStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateEventScreen() {
  const router = useRouter();
  const { events, addEvent } = useEventStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  });
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, category]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 3 categories');
      }
    }
  };
  
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    
    if (selectedDate) {
      const currentDate = startDate || new Date();
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      setStartDate(selectedDate);
      
      // If end date is before start date, update end date
      if (endDate && endDate < selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setHours(newEndDate.getHours() + 2);
        setEndDate(newEndDate);
      }
    }
  };
  
  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    
    if (selectedTime) {
      const currentDate = startDate || new Date();
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      setStartDate(currentDate);
      
      // If end time is before start time on the same day, update end time
      if (endDate && 
          endDate.getDate() === currentDate.getDate() && 
          endDate.getMonth() === currentDate.getMonth() && 
          endDate.getFullYear() === currentDate.getFullYear() && 
          endDate < currentDate) {
        const newEndDate = new Date(currentDate);
        newEndDate.setHours(newEndDate.getHours() + 2);
        setEndDate(newEndDate);
      }
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    
    if (selectedDate) {
      const currentDate = endDate || new Date();
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      
      // Ensure end date is not before start date
      if (startDate && selectedDate < startDate) {
        Alert.alert('Invalid Date', 'End date cannot be before start date');
        return;
      }
      
      setEndDate(selectedDate);
    }
  };
  
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    
    if (selectedTime) {
      const currentDate = endDate || new Date();
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      
      // Ensure end time is not before start time on the same day
      if (startDate && 
          startDate.getDate() === currentDate.getDate() && 
          startDate.getMonth() === currentDate.getMonth() && 
          startDate.getFullYear() === currentDate.getFullYear() && 
          currentDate < startDate) {
        Alert.alert('Invalid Time', 'End time cannot be before start time');
        return;
      }
      
      setEndDate(currentDate);
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!title) {
      Alert.alert('Missing Information', 'Please enter an event title');
      return;
    }
    
    if (!description) {
      Alert.alert('Missing Information', 'Please enter an event description');
      return;
    }
    
    if (!startDate || !endDate) {
      Alert.alert('Missing Information', 'Please select start and end dates');
      return;
    }
    
    if (selectedCategories.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one category');
      return;
    }
    
    if (!isOnline && !location) {
      Alert.alert('Missing Information', 'Please enter a location');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new event object
    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: {
        type: isOnline ? 'online' : 'in-person',
        address: isOnline ? undefined : location,
        city: isOnline ? undefined : city,
        country: isOnline ? undefined : country,
        link: isOnline ? location : undefined
      },
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
      organizer: {
        id: 'user-1',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
      },
      categories: selectedCategories,
      attendees: 0,
      maxAttendees: capacity ? parseInt(capacity) : undefined,
      price: price ? {
        amount: parseFloat(price),
        currency: 'USD'
      } : undefined
    };
    
    // Add event to store
    setTimeout(() => {
      addEvent(newEvent);
      setIsSubmitting(false);
      
      Alert.alert(
        'Event Created',
        'Your event has been created successfully!',
        [
          { 
            text: 'View Event', 
            onPress: () => router.push(`/event/${newEvent.id}`) 
          },
          {
            text: 'Back to Home',
            onPress: () => router.push('/')
          }
        ]
      );
    }, 1000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Create Event",
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
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event title"
                placeholderTextColor={colors.dark.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your event"
                placeholderTextColor={colors.dark.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Online Event</Text>
                <Switch
                  value={isOnline}
                  onValueChange={setIsOnline}
                  trackColor={{ false: colors.dark.border, true: colors.primary }}
                  thumbColor="white"
                />
              </View>
            </View>
            
            {isOnline ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Event Link *</Text>
                <View style={styles.inputWithIcon}>
                  <MapPin size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="Enter event link (e.g., Zoom, Google Meet)"
                    placeholderTextColor={colors.dark.textSecondary}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Venue Address *</Text>
                  <View style={styles.inputWithIcon}>
                    <MapPin size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.iconInput}
                      placeholder="Enter venue address"
                      placeholderTextColor={colors.dark.textSecondary}
                      value={location}
                      onChangeText={setLocation}
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    placeholderTextColor={colors.dark.textSecondary}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter country"
                    placeholderTextColor={colors.dark.textSecondary}
                    value={country}
                    onChangeText={setCountry}
                  />
                </View>
              </>
            )}
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Date & Time *</Text>
              <View style={styles.dateTimeContainer}>
                <Pressable 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Calendar size={20} color={colors.dark.textSecondary} style={styles.datePickerIcon} />
                  <Text style={startDate ? styles.datePickerText : styles.datePickerPlaceholder}>
                    {startDate ? formatDate(startDate) : "Select date"}
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Clock size={20} color={colors.dark.textSecondary} style={styles.datePickerIcon} />
                  <Text style={startDate ? styles.datePickerText : styles.datePickerPlaceholder}>
                    {startDate ? formatTime(startDate) : "Select time"}
                  </Text>
                </Pressable>
              </View>
              
              {Platform.OS !== 'web' && showStartDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}
              
              {Platform.OS !== 'web' && showStartTimePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>End Date & Time *</Text>
              <View style={styles.dateTimeContainer}>
                <Pressable 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Calendar size={20} color={colors.dark.textSecondary} style={styles.datePickerIcon} />
                  <Text style={endDate ? styles.datePickerText : styles.datePickerPlaceholder}>
                    {endDate ? formatDate(endDate) : "Select date"}
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Clock size={20} color={colors.dark.textSecondary} style={styles.datePickerIcon} />
                  <Text style={endDate ? styles.datePickerText : styles.datePickerPlaceholder}>
                    {endDate ? formatTime(endDate) : "Select time"}
                  </Text>
                </Pressable>
              </View>
              
              {Platform.OS !== 'web' && showEndDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={startDate || undefined}
                />
              )}
              
              {Platform.OS !== 'web' && showEndTimePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              )}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Categories *</Text>
            <Text style={styles.helperText}>Select up to 3 categories</Text>
            
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  category={category.id as EventCategory}
                  selected={selectedCategories.includes(category.id as EventCategory)}
                  onPress={() => toggleCategory(category.id as EventCategory)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price (USD)</Text>
              <View style={styles.inputWithIcon}>
                <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="0.00 (free if left empty)"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity</Text>
              <View style={styles.inputWithIcon}>
                <Users size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Maximum number of attendees"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <Pressable style={styles.imageUploadButton}>
              <ImageIcon size={20} color={colors.primary} />
              <Text style={styles.imageUploadText}>Upload Event Image</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={[
              styles.submitButton,
              isSubmitting && styles.submittingButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submittingContainer}>
                <Text style={styles.submitButtonText}>Creating Event...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Create Event</Text>
            )}
          </Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: colors.dark.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  iconInput: {
    flex: 1,
    padding: 12,
    color: colors.dark.text,
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 0.48,
  },
  datePickerIcon: {
    marginRight: 8,
  },
  datePickerText: {
    color: colors.dark.text,
    fontSize: 16,
  },
  datePickerPlaceholder: {
    color: colors.dark.textSecondary,
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: -12,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(138, 111, 232, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  imageUploadText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submittingButton: {
    opacity: 0.7,
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});