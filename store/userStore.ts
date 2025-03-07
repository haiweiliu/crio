import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  isVip: boolean;
  vipExpiryDate?: string;
  eventsAttended: number;
  eventsOrganized: number;
}

interface UserState {
  profile: UserProfile;
  
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  upgradeToVip: () => void;
  cancelVip: () => void;
  
  // VIP benefits
  getEventDiscount: (price: number) => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        bio: 'Web3 enthusiast and event organizer. Love connecting with like-minded people in the blockchain space.',
        isVip: false,
        eventsAttended: 12,
        eventsOrganized: 3,
      },
      
      updateProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile }
      })),
      
      upgradeToVip: () => {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        
        set((state) => ({
          profile: {
            ...state.profile,
            isVip: true,
            vipExpiryDate: expiryDate.toISOString()
          }
        }));
      },
      
      cancelVip: () => set((state) => ({
        profile: {
          ...state.profile,
          isVip: false,
          vipExpiryDate: undefined
        }
      })),
      
      getEventDiscount: (price) => {
        const { isVip } = get().profile;
        if (isVip) {
          // 15% discount for VIP members
          return price * 0.15;
        }
        return 0;
      }
    }),
    {
      name: 'crio-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);