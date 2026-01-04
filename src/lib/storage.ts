// Local storage utilities for Digital Closet app

import { ClothingItem, Outfit, UserPreferences } from '@/types/closet';

const STORAGE_KEYS = {
  CLOTHING_ITEMS: 'digital-closet-items',
  OUTFITS: 'digital-closet-outfits',
  USER_PREFERENCES: 'digital-closet-preferences',
} as const;

// Clothing Items
export const getClothingItems = (): ClothingItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLOTHING_ITEMS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading clothing items from storage:', error);
    return [];
  }
};

export const saveClothingItems = (items: ClothingItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CLOTHING_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving clothing items to storage:', error);
  }
};

export const addClothingItem = (item: ClothingItem): void => {
  const items = getClothingItems();
  items.push(item);
  saveClothingItems(items);
};

export const updateClothingItem = (id: string, updates: Partial<ClothingItem>): void => {
  const items = getClothingItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveClothingItems(items);
  }
};

export const deleteClothingItem = (id: string): void => {
  const items = getClothingItems();
  const filtered = items.filter(item => item.id !== id);
  saveClothingItems(filtered);
};

export const getClothingItemsByCategory = (category: string): ClothingItem[] => {
  const items = getClothingItems();
  return items.filter(item => item.category === category);
};

// Outfits
export const getOutfits = (): Outfit[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OUTFITS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading outfits from storage:', error);
    return [];
  }
};

export const saveOutfits = (outfits: Outfit[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));
  } catch (error) {
    console.error('Error saving outfits to storage:', error);
  }
};

export const addOutfit = (outfit: Outfit): void => {
  const outfits = getOutfits();
  outfits.push(outfit);
  saveOutfits(outfits);
};

export const getRecentOutfits = (limit: number = 7): Outfit[] => {
  const outfits = getOutfits();
  return outfits
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, limit);
};

// User Preferences
export const getUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') {
    return {
      locationEnabled: false,
      onboardingComplete: false,
      temperatureUnit: 'F',
    };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading user preferences from storage:', error);
  }
  return {
    locationEnabled: false,
    onboardingComplete: false,
    temperatureUnit: 'F',
  };
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences to storage:', error);
  }
};

export const updateOnboardingComplete = (complete: boolean): void => {
  const prefs = getUserPreferences();
  prefs.onboardingComplete = complete;
  saveUserPreferences(prefs);
};

export const updateLocationEnabled = (enabled: boolean): void => {
  const prefs = getUserPreferences();
  prefs.locationEnabled = enabled;
  saveUserPreferences(prefs);
};

// Clear all data (for testing/debugging)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
