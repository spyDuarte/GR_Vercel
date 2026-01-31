import type { ClothingItem, Outfit } from '@/types';

const API_BASE = '/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const userId = localStorage.getItem('user-id') || 'demo-user';
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Items API
export async function getItems(): Promise<ClothingItem[]> {
  try {
    const data = await fetchWithAuth(`${API_BASE}/items`);
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch items:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-items');
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveItem(item: ClothingItem): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  } catch (error) {
    console.error('Failed to save item:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-items');
    const items = stored ? JSON.parse(stored) : [];
    items.push(item);
    localStorage.setItem('wardrobe-items', JSON.stringify(items));
  }
}

export async function updateItem(id: string, updates: Partial<ClothingItem>): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/items`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  } catch (error) {
    console.error('Failed to update item:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-items');
    if (stored) {
      const items = JSON.parse(stored);
      const updated = items.map((item: ClothingItem) => 
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem('wardrobe-items', JSON.stringify(updated));
    }
  }
}

export async function deleteItem(id: string): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/items?id=${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete item:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-items');
    if (stored) {
      const items = JSON.parse(stored);
      const filtered = items.filter((item: ClothingItem) => item.id !== id);
      localStorage.setItem('wardrobe-items', JSON.stringify(filtered));
    }
  }
}

// Outfits API
export async function getOutfits(): Promise<Outfit[]> {
  try {
    const data = await fetchWithAuth(`${API_BASE}/outfits`);
    return data.outfits || [];
  } catch (error) {
    console.error('Failed to fetch outfits:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-outfits');
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveOutfit(outfit: Outfit): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/outfits`, {
      method: 'POST',
      body: JSON.stringify(outfit),
    });
  } catch (error) {
    console.error('Failed to save outfit:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-outfits');
    const outfits = stored ? JSON.parse(stored) : [];
    outfits.push(outfit);
    localStorage.setItem('wardrobe-outfits', JSON.stringify(outfits));
  }
}

export async function updateOutfit(id: string, updates: Partial<Outfit>): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/outfits`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  } catch (error) {
    console.error('Failed to update outfit:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-outfits');
    if (stored) {
      const outfits = JSON.parse(stored);
      const updated = outfits.map((outfit: Outfit) => 
        outfit.id === id ? { ...outfit, ...updates } : outfit
      );
      localStorage.setItem('wardrobe-outfits', JSON.stringify(updated));
    }
  }
}

export async function deleteOutfit(id: string): Promise<void> {
  try {
    await fetchWithAuth(`${API_BASE}/outfits?id=${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete outfit:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('wardrobe-outfits');
    if (stored) {
      const outfits = JSON.parse(stored);
      const filtered = outfits.filter((outfit: Outfit) => outfit.id !== id);
      localStorage.setItem('wardrobe-outfits', JSON.stringify(filtered));
    }
  }
}
