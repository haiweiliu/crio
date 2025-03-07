import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, EventCategory } from '@/types/event';
import { events as mockEvents } from '@/mocks/events';

interface EventState {
  events: Event[];
  savedEventIds: string[];
  registeredEventIds: string[];
  selectedCategories: EventCategory[];
  searchQuery: string;
  sortBy: 'date' | 'popularity' | 'price';
  
  // Actions
  saveEvent: (eventId: string) => void;
  unsaveEvent: (eventId: string) => void;
  toggleSaveEvent: (eventId: string) => void;
  isSaved: (eventId: string) => boolean;
  
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  isRegistered: (eventId: string) => boolean;
  
  setSelectedCategories: (categories: EventCategory[]) => void;
  toggleCategory: (category: EventCategory) => void;
  
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'date' | 'popularity' | 'price') => void;
  
  // Event management
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  
  // Selectors
  getFilteredEvents: () => Event[];
  getSavedEvents: () => Event[];
  getRegisteredEvents: () => Event[];
  getEventById: (id: string) => Event | undefined;
  getUpcomingEvents: () => Event[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      savedEventIds: [],
      registeredEventIds: [],
      selectedCategories: [],
      searchQuery: '',
      sortBy: 'date',
      
      saveEvent: (eventId) => set((state) => ({
        savedEventIds: [...state.savedEventIds, eventId]
      })),
      
      unsaveEvent: (eventId) => set((state) => ({
        savedEventIds: state.savedEventIds.filter(id => id !== eventId)
      })),
      
      toggleSaveEvent: (eventId) => {
        const isSaved = get().isSaved(eventId);
        if (isSaved) {
          get().unsaveEvent(eventId);
        } else {
          get().saveEvent(eventId);
        }
      },
      
      isSaved: (eventId) => get().savedEventIds.includes(eventId),
      
      registerForEvent: (eventId) => set((state) => {
        // Also save the event when registering
        const newSavedIds = state.savedEventIds.includes(eventId) 
          ? state.savedEventIds 
          : [...state.savedEventIds, eventId];
          
        // Increment attendees count
        const updatedEvents = state.events.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              attendees: event.attendees + 1
            };
          }
          return event;
        });
        
        return {
          registeredEventIds: [...state.registeredEventIds, eventId],
          savedEventIds: newSavedIds,
          events: updatedEvents
        };
      }),
      
      unregisterFromEvent: (eventId) => set((state) => {
        // Decrement attendees count
        const updatedEvents = state.events.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              attendees: Math.max(0, event.attendees - 1)
            };
          }
          return event;
        });
        
        return {
          registeredEventIds: state.registeredEventIds.filter(id => id !== eventId),
          events: updatedEvents
        };
      }),
      
      isRegistered: (eventId) => get().registeredEventIds.includes(eventId),
      
      setSelectedCategories: (categories) => set({
        selectedCategories: categories
      }),
      
      toggleCategory: (category) => set((state) => {
        if (state.selectedCategories.includes(category)) {
          return {
            selectedCategories: state.selectedCategories.filter(c => c !== category)
          };
        } else {
          return {
            selectedCategories: [...state.selectedCategories, category]
          };
        }
      }),
      
      setSearchQuery: (query) => set({
        searchQuery: query
      }),
      
      setSortBy: (sortBy) => set({
        sortBy
      }),
      
      addEvent: (event) => set((state) => ({
        events: [event, ...state.events]
      })),
      
      updateEvent: (eventId, updates) => set((state) => ({
        events: state.events.map(event => 
          event.id === eventId ? { ...event, ...updates } : event
        )
      })),
      
      deleteEvent: (eventId) => set((state) => ({
        events: state.events.filter(event => event.id !== eventId),
        savedEventIds: state.savedEventIds.filter(id => id !== eventId),
        registeredEventIds: state.registeredEventIds.filter(id => id !== eventId)
      })),
      
      getFilteredEvents: () => {
        const { events, selectedCategories, searchQuery, sortBy } = get();
        
        let filteredEvents = events.filter(event => {
          // Filter by search query
          const matchesSearch = searchQuery === '' || 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Filter by categories
          const matchesCategories = selectedCategories.length === 0 || 
            event.categories.some(category => selectedCategories.includes(category));
          
          return matchesSearch && matchesCategories;
        });
        
        // Sort events
        switch (sortBy) {
          case 'date':
            filteredEvents = filteredEvents.sort((a, b) => 
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            break;
          case 'popularity':
            filteredEvents = filteredEvents.sort((a, b) => 
              b.attendees - a.attendees
            );
            break;
          case 'price':
            filteredEvents = filteredEvents.sort((a, b) => {
              const aPrice = a.price?.amount || 0;
              const bPrice = b.price?.amount || 0;
              return aPrice - bPrice;
            });
            break;
        }
        
        return filteredEvents;
      },
      
      getSavedEvents: () => {
        const { events, savedEventIds } = get();
        return events.filter(event => savedEventIds.includes(event.id));
      },
      
      getRegisteredEvents: () => {
        const { events, registeredEventIds } = get();
        return events.filter(event => registeredEventIds.includes(event.id));
      },
      
      getUpcomingEvents: () => {
        const { events, registeredEventIds } = get();
        const now = new Date();
        
        return events
          .filter(event => 
            registeredEventIds.includes(event.id) && 
            new Date(event.startDate) > now
          )
          .sort((a, b) => 
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
      },
      
      getEventById: (id) => {
        const event = get().events.find(event => event.id === id);
        if (event) {
          // Add registration status to the event
          return {
            ...event,
            isRegistered: get().registeredEventIds.includes(id)
          };
        }
        return event;
      }
    }),
    {
      name: 'crio-events-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        savedEventIds: state.savedEventIds,
        registeredEventIds: state.registeredEventIds,
        selectedCategories: state.selectedCategories
      }),
    }
  )
);