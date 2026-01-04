// Zustand store for Digital Closet app

import { create } from 'zustand';
import { ClothingItem, Outfit, WeatherData, UserPreferences } from '@/types/closet';
import {
  getClothingItems,
  addClothingItem,
  updateClothingItem,
  deleteClothingItem,
  getClothingItemsByCategory,
  addOutfit,
  getOutfits,
  getUserPreferences,
  saveUserPreferences,
} from '@/lib/storage';

interface ClosetStore {
  // State
  clothingItems: ClothingItem[];
  outfits: Outfit[];
  currentWeather: WeatherData | null;
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeStore: () => void;
  addClothing: (item: ClothingItem) => void;
  updateClothing: (id: string, updates: Partial<ClothingItem>) => void;
  removeClothing: (id: string) => void;
  refreshClothing: () => void;
  setCurrentWeather: (weather: WeatherData | null) => void;
  generateOutfit: (type: 'weather' | 'random') => Outfit | null;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  clearError: () => void;
}

export const useClosetStore = create<ClosetStore>((set, get) => ({
  // Initial state
  clothingItems: [],
  outfits: [],
  currentWeather: null,
  userPreferences: {
    locationEnabled: false,
    onboardingComplete: false,
    temperatureUnit: 'F',
  },
  isLoading: false,
  error: null,

  // Initialize store from local storage
  initializeStore: () => {
    const items = getClothingItems();
    const outfits = getOutfits();
    const prefs = getUserPreferences();
    set({
      clothingItems: items,
      outfits,
      userPreferences: prefs,
    });
  },

  // Add a new clothing item
  addClothing: (item: ClothingItem) => {
    addClothingItem(item);
    set(state => ({
      clothingItems: [...state.clothingItems, item],
    }));
  },

  // Update an existing clothing item
  updateClothing: (id: string, updates: Partial<ClothingItem>) => {
    updateClothingItem(id, updates);
    set(state => ({
      clothingItems: state.clothingItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  // Remove a clothing item
  removeClothing: (id: string) => {
    deleteClothingItem(id);
    set(state => ({
      clothingItems: state.clothingItems.filter(item => item.id !== id),
    }));
  },

  // Refresh clothing items from storage
  refreshClothing: () => {
    const items = getClothingItems();
    set({ clothingItems: items });
  },

  // Set current weather
  setCurrentWeather: (weather: WeatherData | null) => {
    set({ currentWeather: weather });
  },

  // Generate an outfit
  generateOutfit: (type: 'weather' | 'random') => {
    const state = get();
    const { clothingItems, currentWeather } = state;

    const tops = clothingItems.filter(item => item.category === 'Top');
    const bottoms = clothingItems.filter(item => item.category === 'Bottom');
    const shoes = clothingItems.filter(item => item.category === 'Shoe');

    if (tops.length === 0 && bottoms.length === 0 && shoes.length === 0) {
      set({ error: 'Add clothing items to your closet first!' });
      return null;
    }

    let selectedTop: ClothingItem | undefined;
    let selectedBottom: ClothingItem | undefined;
    let selectedShoe: ClothingItem | undefined;

    // Weather-based logic
    if (type === 'weather' && currentWeather) {
      const tempF = state.userPreferences.temperatureUnit === 'F'
        ? currentWeather.temperature
        : (currentWeather.temperature * 9/5) + 32;

      const preferHeavier = tempF < 40;
      const preferLighter = tempF > 70;

      // Filter tops by material based on temperature
      const filteredTops = tops.filter(top => {
        if (preferHeavier) return top.material === 'Heavy' || top.material === 'Medium';
        if (preferLighter) return top.material === 'Light' || top.material === 'Medium';
        return true;
      });

      // Filter bottoms by material based on temperature
      const filteredBottoms = bottoms.filter(bottom => {
        if (preferHeavier) return bottom.material === 'Heavy' || bottom.material === 'Medium';
        if (preferLighter) return bottom.material === 'Light' || bottom.material === 'Medium';
        return true;
      });

      selectedTop = filteredTops.length > 0
        ? filteredTops[Math.floor(Math.random() * filteredTops.length)]
        : tops[Math.floor(Math.random() * tops.length)] || undefined;

      selectedBottom = filteredBottoms.length > 0
        ? filteredBottoms[Math.floor(Math.random() * filteredBottoms.length)]
        : bottoms[Math.floor(Math.random() * bottoms.length)] || undefined;
    } else {
      // Random selection
      selectedTop = tops.length > 0
        ? tops[Math.floor(Math.random() * tops.length)]
        : undefined;

      selectedBottom = bottoms.length > 0
        ? bottoms[Math.floor(Math.random() * bottoms.length)]
        : undefined;
    }

    // Shoes are always random
    selectedShoe = shoes.length > 0
      ? shoes[Math.floor(Math.random() * shoes.length)]
      : undefined;

    const outfit: Outfit = {
      id: Date.now().toString(),
      top: selectedTop,
      bottom: selectedBottom,
      shoes: selectedShoe,
      generatedAt: new Date().toISOString(),
      type,
    };

    addOutfit(outfit);
    set(state => ({
      outfits: [...state.outfits, outfit],
    }));

    return outfit;
  },

  // Update user preferences
  updatePreferences: (updates: Partial<UserPreferences>) => {
    const currentPrefs = get().userPreferences;
    const newPrefs = { ...currentPrefs, ...updates };
    saveUserPreferences(newPrefs);
    set({ userPreferences: newPrefs });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
