import { useCallback, useMemo, useState, useEffect } from 'react';
import type { ClothingItem, Outfit, Category } from '@/types';
import {
  getItems,
  saveItem,
  updateItem,
  deleteItem,
  getOutfits,
  saveOutfit,
  updateOutfit,
  deleteOutfit,
} from '@/lib/api';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedItems, loadedOutfits] = await Promise.all([
          getItems(),
          getOutfits(),
        ]);
        setItems(loadedItems);
        setOutfits(loadedOutfits);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addItem = useCallback(async (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    await saveItem(newItem);
    setItems(prev => [newItem, ...prev]);
    return newItem.id;
  }, []);

  const updateItemLocal = useCallback(async (id: string, updates: Partial<ClothingItem>) => {
    await updateItem(id, updates);
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItemLocal = useCallback(async (id: string) => {
    await deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
    // Also remove from outfits
    setOutfits(prev => prev.map(outfit => ({
      ...outfit,
      items: outfit.items.filter(itemId => itemId !== id)
    })));
  }, []);

  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const getItemsByCategory = useCallback((category: Category) => {
    return items.filter(item => item.category === category);
  }, [items]);

  const addOutfit = useCallback(async (outfit: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    await saveOutfit(newOutfit);
    setOutfits(prev => [newOutfit, ...prev]);
    return newOutfit.id;
  }, []);

  const updateOutfitLocal = useCallback(async (id: string, updates: Partial<Outfit>) => {
    await updateOutfit(id, updates);
    setOutfits(prev => prev.map(outfit => 
      outfit.id === id ? { ...outfit, ...updates } : outfit
    ));
  }, []);

  const deleteOutfitLocal = useCallback(async (id: string) => {
    await deleteOutfit(id);
    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
  }, []);

  const getOutfitById = useCallback((id: string) => {
    return outfits.find(outfit => outfit.id === id);
  }, [outfits]);

  const getOutfitItems = useCallback((outfitId: string) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return [];
    return outfit.items.map(itemId => items.find(item => item.id === itemId)).filter(Boolean) as ClothingItem[];
  }, [outfits, items]);

  const stats = useMemo(() => ({
    totalItems: items.length,
    totalOutfits: outfits.length,
    categoriesCount: new Set(items.map(item => item.category)).size,
    recentItems: items.slice(0, 5),
  }), [items, outfits]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      camisetas: 0,
      calcas: 0,
      vestidos: 0,
      sapatos: 0,
      acessorios: 0,
      casacos: 0,
      shorts: 0,
      saias: 0,
    };
    items.forEach(item => {
      counts[item.category]++;
    });
    return counts;
  }, [items]);

  return {
    items,
    outfits,
    isLoading,
    stats,
    categoryCounts,
    addItem,
    updateItem: updateItemLocal,
    deleteItem: deleteItemLocal,
    getItemById,
    getItemsByCategory,
    addOutfit,
    updateOutfit: updateOutfitLocal,
    deleteOutfit: deleteOutfitLocal,
    getOutfitById,
    getOutfitItems,
  };
}
