import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, Minus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ClothingItem, Category } from '@/types';
import { CATEGORIES } from '@/types';

interface CreateOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outfit: { name: string; items: string[] }) => void;
  items: ClothingItem[];
}

export function CreateOutfitModal({ isOpen, onClose, onSave, items }: CreateOutfitModalProps) {
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const selectedItemsData = useMemo(() => {
    return items.filter(item => selectedItems.includes(item.id));
  }, [items, selectedItems]);

  const toggleItem = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim() || selectedItems.length === 0) return;
    
    onSave({
      name: name.trim(),
      items: selectedItems,
    });

    setName('');
    setSelectedItems([]);
    setSearchQuery('');
    setSelectedCategory('all');
    onClose();
  }, [name, selectedItems, onSave, onClose]);

  const handleClose = useCallback(() => {
    setName('');
    setSelectedItems([]);
    setSearchQuery('');
    setSelectedCategory('all');
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Novo Look</h2>
                <p className="text-sm text-gray-500">{selectedItems.length} peças selecionadas</p>
              </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Selected Items Preview */}
            {selectedItemsData.length > 0 && (
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {selectedItemsData.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-[#E88C44]">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Sparkles className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Outfit Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome do Look</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Look Casual de Domingo"
                  className="h-12 rounded-xl border-gray-200 focus:border-[#E88C44] focus:ring-[#E88C44]/20"
                />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar peças..."
                  className="h-12 pl-12 rounded-xl border-gray-200 focus:border-[#E88C44] focus:ring-[#E88C44]/20"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${selectedCategory === 'all'
                      ? 'bg-[#E88C44] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  Todas
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${selectedCategory === cat.id
                        ? 'bg-[#E88C44] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-3 gap-3">
                {filteredItems.map((item, idx) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => toggleItem(item.id)}
                      className={`
                        relative aspect-square rounded-xl overflow-hidden
                        transition-all duration-200
                        ${isSelected 
                          ? 'ring-2 ring-[#E88C44] ring-offset-2' 
                          : 'hover:opacity-80'
                        }
                      `}
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Sparkles className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#E88C44]/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-[#E88C44] rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma peça encontrada</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 safe-area-bottom">
              <Button
                onClick={handleSave}
                disabled={!name.trim() || selectedItems.length === 0}
                className="w-full h-14 rounded-xl bg-[#E88C44] hover:bg-[#d67a33] text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5 mr-2" />
                Criar Look
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
