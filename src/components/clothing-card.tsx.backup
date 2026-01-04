'use client';

// Clothing card component for displaying and editing items
import * as React from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClothingItem, ClothingCategory, ColorCategory, Material } from '@/types/closet';
import { toast } from '@/hooks/use-toast';

interface ClothingCardProps {
  item: ClothingItem;
  onUpdate?: (id: string, updates: Partial<ClothingItem>) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function ClothingCard({ item, onUpdate, onDelete, showActions = true }: ClothingCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(item.name);
  const [editCategory, setEditCategory] = React.useState<ClothingCategory>(item.category);
  const [editMaterial, setEditMaterial] = React.useState<Material>(item.material);
  const [editColors, setEditColors] = React.useState<ColorCategory[]>(item.colors);

  const categoryOptions: ClothingCategory[] = ['Top', 'Bottom', 'Shoe'];
  const materialOptions: Material[] = ['Heavy', 'Medium', 'Light'];
  const colorOptions: ColorCategory[] = [
    'Black', 'White', 'Gray', 'Brown', 'Beige',
    'Red', 'Pink', 'Orange', 'Yellow',
    'Green', 'Blue', 'Purple', 'Pattern', 'Multi'
  ];

  const handleSave = () => {
    if (!editName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please give your item a name.',
        variant: 'destructive',
      });
      return;
    }

    onUpdate?.(item.id, {
      name: editName.trim(),
      category: editCategory,
      material: editMaterial,
      colors: editColors,
    });

    setIsEditing(false);
    toast({
      title: 'Updated',
      description: 'Your item has been updated.',
    });
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditCategory(item.category);
    setEditMaterial(item.material);
    setEditColors(item.colors);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this item from your closet?')) {
      onDelete?.(item.id);
      toast({
        title: 'Removed',
        description: 'Item has been removed from your closet.',
      });
    }
  };

  const toggleColor = (color: ColorCategory) => {
    setEditColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {showActions && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="bg-white/90 hover:bg-red-500 text-red-500 hover:text-white"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2"
            >
              {item.category}
            </Badge>
          </div>

          {/* Details */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
            <div className="flex gap-1 flex-wrap">
              {item.colors.slice(0, 3).map((color) => (
                <Badge
                  key={color}
                  variant="outline"
                  className="text-xs"
                >
                  {color}
                </Badge>
              ))}
              {item.colors.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.colors.length - 3}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {item.material}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map((cat) => (
                  <Badge
                    key={cat}
                    variant={editCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setEditCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-2">
              <Label>Material *</Label>
              <div className="flex gap-2 flex-wrap">
                {materialOptions.map((mat) => (
                  <Badge
                    key={mat}
                    variant={editMaterial === mat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setEditMaterial(mat)}
                  >
                    {mat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label>Colors *</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <Badge
                    key={color}
                    variant={editColors.includes(color) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleColor(color)}
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Check className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
