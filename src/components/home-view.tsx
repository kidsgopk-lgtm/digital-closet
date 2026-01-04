'use client';

import * as React from 'react';
import { Cloud, Sun, MapPin, RefreshCw, Loader2, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClothingCard } from '@/components/clothing-card';
import { UploadModal } from '@/components/upload-modal';
import { ClothingItem } from '@/types/closet';
import { useClosetStore } from '@/store/closet-store';
import { WeatherData } from '@/types/closet';

// Type alias for the outfit type
type Outfit = ReturnType<typeof useClosetStore.getState().generateOutfit>;

export function HomeView() {
  const { clothingItems, currentWeather, userPreferences, generateOutfit, setCurrentWeather, updatePreferences, addClothing } = useClosetStore();
  const [currentOutfit, setCurrentOutfit] = React.useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  // Load weather data on mount
  React.useEffect(() => {
    if (userPreferences.locationEnabled) {
      fetchWeather();
    }
  }, [userPreferences.locationEnabled]);

  const fetchWeather = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const unit = userPreferences.temperatureUnit;
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }

      const weatherData: WeatherData = await response.json();
      setCurrentWeather(weatherData);
      setLocationError(null);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setLocationError('Unable to fetch weather data');
    }
  };

  const handleGenerateOutfit = (type: 'weather' | 'random') => {
    setIsLoading(true);
    setTimeout(() => {
      const outfit = generateOutfit(type);
      setCurrentOutfit(outfit);
      setIsLoading(false);
    }, 500);
  };

  const handleUpload = (item: {
    name: string;
    image: string;
    category: ClothingItem['category'];
    colors: ClothingItem['colors'];
    material: ClothingItem['material'];
  }) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    addClothing(newItem);
  };

  const getWeatherIcon = () => {
    if (!currentWeather) return null;
    const condition = currentWeather.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <Cloud className="h-12 w-12 text-blue-400" />;
    }
    if (condition.includes('sun') || condition.includes('clear')) {
      return <Sun className="h-12 w-12 text-yellow-400" />;
    }
    if (condition.includes('cloud') || condition.includes('overcast')) {
      return <Cloud className="h-12 w-12 text-gray-400" />;
    }
    return <Cloud className="h-12 w-12" />;
  };

  const getTemperatureAdvice = () => {
    if (!currentWeather) return null;
    const temp = currentWeather.temperature;
    const unit = userPreferences.temperatureUnit;

    if (temp < 40) {
      return 'It\'s cold! Wear heavy fabrics and layers.';
    } else if (temp < 60) {
      return 'Cool weather. Medium-weight clothing is perfect.';
    } else if (temp < 70) {
      return 'Mild weather. You can mix light and medium fabrics.';
    } else {
      return 'It\'s warm! Light fabrics and breathable clothing are best.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Today's Suggestion</h1>
        <p className="text-muted-foreground mt-1">
          Let's help you get ready in 2 minutes
        </p>
      </div>

      {/* Weather Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!userPreferences.locationEnabled ? (
            <div className="text-center py-8">
              <Cloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Enable location to get weather-based outfit suggestions
              </p>
              <Button onClick={() => updatePreferences({ locationEnabled: true })}>
                Enable Location
              </Button>
            </div>
          ) : currentWeather ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon()}
                <div>
                  <div className="text-3xl font-bold">
                    {Math.round(currentWeather.temperature)}°{userPreferences.temperatureUnit}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentWeather.condition}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {currentWeather.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{getTemperatureAdvice()}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              {locationError ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">{locationError}</p>
                  <Button variant="outline" size="sm" onClick={fetchWeather}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Fetching weather...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outfit Section */}
      {clothingItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your closet is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add some clothing items to start generating outfit suggestions based on the weather.
            </p>
            <UploadModal onUpload={handleUpload}>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Your First Item
              </Button>
            </UploadModal>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Generate Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => handleGenerateOutfit('weather')}
              disabled={isLoading || clothingItems.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Weather-Based Outfit
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => handleGenerateOutfit('random')}
              disabled={isLoading || clothingItems.length === 0}
            >
              <RefreshCw className="h-5 w-5" />
              Random Outfit
            </Button>
          </div>

          {/* Current Outfit Display */}
          {currentOutfit ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentOutfit.type === 'weather' ? "Today's Outfit" : 'Random Selection'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Top */}
                  {currentOutfit.top && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Top</div>
                      <ClothingCard item={currentOutfit.top} showActions={false} />
                    </div>
                  )}

                  {/* Bottom */}
                  {currentOutfit.bottom && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Bottom</div>
                      <ClothingCard item={currentOutfit.bottom} showActions={false} />
                    </div>
                  )}

                  {/* Shoes */}
                  {currentOutfit.shoes && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Shoes</div>
                      <ClothingCard item={currentOutfit.shoes} showActions={false} />
                    </div>
                  )}
                </div>

                {/* Empty items warning */}
                {!currentOutfit.top && !currentOutfit.bottom && !currentOutfit.shoes && (
                  <div className="text-center py-8 text-muted-foreground">
                    Add more clothing items to your closet to generate complete outfits.
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Click the button above to generate an outfit suggestion based on today's weather
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
