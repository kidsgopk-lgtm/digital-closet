// Data models for Digital Closet app

export type ClothingCategory = 'Top' | 'Bottom' | 'Shoe';

export type ColorCategory = 'Black' | 'White' | 'Gray' | 'Brown' | 'Beige' | 'Red' | 'Pink' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'Purple' | 'Pattern' | 'Multi';

export type Material = 'Heavy' | 'Medium' | 'Light';

export interface ClothingItem {
  id: string;
  name: string;
  image: string; // Base64 encoded image
  category: ClothingCategory;
  colors: ColorCategory[];
  material: Material;
  createdAt: string;
  tags?: string[]; // Additional user-defined tags
}

export interface Outfit {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  generatedAt: string;
  type: 'weather' | 'random' | 'manual';
}

export interface UserPreferences {
  locationEnabled: boolean;
  onboardingComplete: boolean;
  temperatureUnit: 'F' | 'C';
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  timestamp: string;
}

export interface GenerateOutfitRequest {
  weather?: WeatherData;
  type: 'weather' | 'random';
}
