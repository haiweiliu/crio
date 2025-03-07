import { EventCategory } from '@/types/event';
import { colors } from '@/constants/colors';

export interface Category {
  id: EventCategory;
  name: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'defi',
    name: 'DeFi',
    color: colors.categories.defi,
    icon: 'trending-up'
  },
  {
    id: 'rwa',
    name: 'RWA',
    color: colors.categories.rwa,
    icon: 'building'
  },
  {
    id: 'depin',
    name: 'DePIN',
    color: colors.categories.depin,
    icon: 'network'
  },
  {
    id: 'ai',
    name: 'AI',
    color: colors.categories.ai,
    icon: 'brain'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    color: colors.categories.gaming,
    icon: 'gamepad-2'
  },
  {
    id: 'social',
    name: 'Social',
    color: colors.categories.social,
    icon: 'message-circle'
  },
  {
    id: 'dev',
    name: 'Developer',
    color: colors.categories.dev,
    icon: 'code'
  },
  {
    id: 'other',
    name: 'Other',
    color: colors.categories.other,
    icon: 'more-horizontal'
  }
];