import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, StatusBar, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Mail, User, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Invalid Input', 'Name cannot be empty');
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Input', 'Please enter a valid email address');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        name,
        email,
        avatar,
        bio,
      });
      
      setIsSaving(false);
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }, 1000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Edit Profile",
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
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: avatar }} 
              style={styles.avatar} 
            />
            <Pressable style={styles.changeAvatarButton} onPress={pickImage}>
              <Camera size={20} color="white" />
            </Pressable>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWithIcon}>
                <User size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWithIcon}>
                <Mail size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your email"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself"
                placeholderTextColor={colors.dark.textSecondary}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <Pressable 
            style={[styles.saveButton, isSaving && styles.savingButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Check size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.dark.background,
  },
  formSection: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 8,
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
  input: {
    flex: 1,
    padding: 12,
    color: colors.dark.text,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});