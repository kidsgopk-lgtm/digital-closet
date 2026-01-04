'use client';

import * as React from 'react';
import { Shirt, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingCard } from '@/components/clothing-card';
import { UploadModal } from '@/components/upload-modal';
import { ClothingItem } from '@/types/closet';
import { useClosetStore } from '@/store/closet-store';

interface WardrobeViewProps {
  className?: string;
}

export function WardrobeView({ className = '' }: WardrobeViewProps) {
  const { clothingItems, updateClothing, removeClothing } = useClosetStore();
  const [filter, setFilter] = React.useState<'All' | 'Top' | 'Bottom' | 'Shoe'>('All');

  const filteredItems = React.useMemo(() => {
    if (filter === 'All') return clothingItems;
    return clothingItems.filter(item => item.category === filter);
  }, [clothingItems, filter]);

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
    useClosetStore.getState().addClothing(newItem);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <p className="text-muted-foreground mt-1">
            {clothingItems.length} {clothingItems.length === 1 ? 'item' : 'items'} in your closet
          </p>
        </div>
        <UploadModal onUpload={handleUpload}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </UploadModal>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'All' ? 'default' : 'outline'}
          onClick={() => setFilter('All')}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          All ({clothingItems.length})
        </Button>
        <Button
          variant={filter === 'Top' ? 'default' : 'outline'}
          onClick={() => setFilter('Top')}
          className="gap-2"
        >
          <Shirt className="h-4 w-4" />
          Tops ({clothingItems.filter(i => i.category === 'Top').length})
        </Button>
        <Button
          variant={filter === 'Bottom' ? 'default' : 'outline'}
          onClick={() => setFilter('Bottom')}
        >
          Bottoms ({clothingItems.filter(i => i.category === 'Bottom').length})
        </Button>
        <Button
          variant={filter === 'Shoe' ? 'default' : 'outline'}
          onClick={() => setFilter('Shoe')}
        >
          Shoes ({clothingItems.filter(i => i.category === 'Shoe').length})
        </Button>
      </div>

      {/* Empty State */}
      {clothingItems.length === 0 ? (
        <div className="text-center py-16">
          <Shirt className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your closet is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start adding your clothing items to build your digital wardrobe. You can upload photos or take pictures with your camera.
          </p>
          <UploadModal onUpload={handleUpload}>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First Item
            </Button>
          </UploadModal>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No {filter.toLowerCase()}s yet</h2>
          <p className="text-muted-foreground mb-6">
            Add some {filter.toLowerCase()}s to see them here.
          </p>
          <UploadModal onUpload={handleUpload}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add {filter}
            </Button>
          </UploadModal>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onUpdate={updateClothing}
              onDelete={removeClothing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
