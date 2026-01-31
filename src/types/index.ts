export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  color: string;
  size: string;
  image: string;
  tags: string[];
  createdAt: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  createdAt: number;
}

export type Category = 
  | 'camisetas'
  | 'calcas'
  | 'vestidos'
  | 'sapatos'
  | 'acessorios'
  | 'casacos'
  | 'shorts'
  | 'saias';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  count: number;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'camisetas', name: 'Camisetas', icon: 'Shirt', count: 0 },
  { id: 'calcas', name: 'Calças', icon: 'Pants', count: 0 },
  { id: 'vestidos', name: 'Vestidos', icon: 'Sparkles', count: 0 },
  { id: 'sapatos', name: 'Sapatos', icon: 'Footprints', count: 0 },
  { id: 'acessorios', name: 'Acessórios', icon: 'Gem', count: 0 },
  { id: 'casacos', name: 'Casacos', icon: 'Shirt', count: 0 },
  { id: 'shorts', name: 'Shorts', icon: 'Zap', count: 0 },
  { id: 'saias', name: 'Saias', icon: 'Triangle', count: 0 },
];

export const COLORS = [
  { name: 'Preto', value: '#1a1a1a' },
  { name: 'Branco', value: '#ffffff' },
  { name: 'Cinza', value: '#808080' },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Laranja', value: '#ea580c' },
  { name: 'Amarelo', value: '#ca8a04' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Azul', value: '#2563eb' },
  { name: 'Roxo', value: '#9333ea' },
  { name: 'Rosa', value: '#db2777' },
  { name: 'Marrom', value: '#92400e' },
  { name: 'Bege', value: '#d4a574' },
];

export const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
