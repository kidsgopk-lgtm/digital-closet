'use client';

import * as React from 'react';
import { Shuffle, Sparkles, Plus, Loader2, Shirt, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClothingCard } from '@/components/clothing-card';
import { UploadModal } from '@/components/upload-modal';
import { ClothingItem, Outfit } from '@/types/closet';
import { useClosetStore } from '@/store/closet-store';

export function OutfitGeneratorView() {
  const { clothingItems, outfits, generateOutfit, addClothing, currentWeather } = useClosetStore();
  const [currentOutfit, setCurrentOutfit] = React.useState<Outfit | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showRecent, setShowRecent] = React.useState(false);

  const handleShuffle = () => {
    setIsAnimating(true);
    setCurrentOutfit(null);

    // Simulate shuffling animation
    let shuffleCount = 0;
    const maxShuffles = 10;
    const shuffleInterval = setInterval(() => {
      const tempOutfit = generateOutfit('random');
      if (tempOutfit) {
        setCurrentOutfit(tempOutfit);
      }
      shuffleCount++;

      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setIsAnimating(false);
      }
    }, 150);
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

  const getRecentOutfits = () => {
    return outfits
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, 10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outfit Generator</h1>
          <p className="text-muted-foreground mt-1">
            Discover new combinations from your closet
          </p>
        </div>
        <UploadModal onUpload={handleUpload}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </UploadModal>
      </div>

      {/* Generator Section */}
      {clothingItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your closet is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add some clothing items to start discovering new outfit combinations.
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
        <div className="space-y-6">
          {/* Shuffle Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    Click shuffle to randomly combine items from your closet. Great for discovering forgotten pieces!
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm">
                      <strong>Tops:</strong> {clothingItems.filter(i => i.category === 'Top').length}
                    </span>
                    <span className="text-sm">
                      <strong>Bottoms:</strong> {clothingItems.filter(i => i.category === 'Bottom').length}
                    </span>
                    <span className="text-sm">
                      <strong>Shoes:</strong> {clothingItems.filter(i => i.category === 'Shoe').length}
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleShuffle}
                  disabled={isAnimating}
                  className="min-w-[180px] gap-2"
                >
                  {isAnimating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Shuffling...
                    </>
                  ) : (
                    <>
                      <Shuffle className="h-5 w-5" />
                      Shuffle
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Outfit Display */}
          {currentOutfit && (
            <Card>
              <CardHeader>
                <CardTitle>Current Combination</CardTitle>
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
          )}

          {/* Recent Outfits Toggle */}
          {outfits.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Recent Combinations
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRecent(!showRecent)}
                  >
                    {showRecent ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showRecent && (
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getRecentOutfits().map((outfit) => (
                      <div key={outfit.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium">
                            {outfit.type === 'weather' ? 'Weather-Based' : 'Random'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(outfit.generatedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {outfit.top && (
                            <img
                              src={outfit.top.image}
                              alt={outfit.top.name}
                              className="w-full aspect-square object-cover rounded"
                            />
                          )}
                          {outfit.bottom && (
                            <img
                              src={outfit.bottom.image}
                              alt={outfit.bottom.name}
                              className="w-full aspect-square object-cover rounded"
                            />
                          )}
                          {outfit.shoes && (
                            <img
                              src={outfit.shoes.image}
                              alt={outfit.shoes.name}
                              className="w-full aspect-square object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
