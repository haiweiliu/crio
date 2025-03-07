export type EventCategory = 
  | 'defi' 
  | 'rwa' 
  | 'depin' 
  | 'ai' 
  | 'gaming' 
  | 'social' 
  | 'dev' 
  | 'other';

export interface EventLocation {
  type: 'online' | 'in-person' | 'hybrid';
  address?: string;
  city?: string;
  country?: string;
  link?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  company?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location: EventLocation;
  imageUrl: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  categories: EventCategory[];
  attendees: number;
  maxAttendees?: number;
  price?: {
    amount: number;
    currency: string;
  };
  isFeatured?: boolean;
  speakers?: EventSpeaker[];
  isRegistered?: boolean;
}