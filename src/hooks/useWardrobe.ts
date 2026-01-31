import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ClothingItem, Outfit, Category } from '@/types';

export function useWardrobe() {
  const [items, setItems] = useLocalStorage<ClothingItem[]>('wardrobe-items', []);
  const [outfits, setOutfits] = useLocalStorage<Outfit[]>('wardrobe-outfits', []);

  const addItem = useCallback((item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem.id;
  }, [setItems]);

  const updateItem = useCallback((id: string, updates: Partial<ClothingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, [setItems]);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setOutfits(prev => prev.map(outfit => ({
      ...outfit,
      items: outfit.items.filter(itemId => itemId !== id)
    })));
  }, [setItems, setOutfits]);

  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const getItemsByCategory = useCallback((category: Category) => {
    return items.filter(item => item.category === category);
  }, [items]);

  const addOutfit = useCallback((outfit: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setOutfits(prev => [newOutfit, ...prev]);
    return newOutfit.id;
  }, [setOutfits]);

  const updateOutfit = useCallback((id: string, updates: Partial<Outfit>) => {
    setOutfits(prev => prev.map(outfit => 
      outfit.id === id ? { ...outfit, ...updates } : outfit
    ));
  }, [setOutfits]);

  const deleteOutfit = useCallback((id: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
  }, [setOutfits]);

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
    stats,
    categoryCounts,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByCategory,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    getOutfitById,
    getOutfitItems,
  };
}
