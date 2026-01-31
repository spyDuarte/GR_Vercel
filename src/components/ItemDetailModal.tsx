import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Edit3, Calendar, Tag, Ruler, Palette } from 'lucide-react';
import type { ClothingItem } from '@/types';
import { CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface ItemDetailModalProps {
  item: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose, onDelete, onEdit }: ItemDetailModalProps) {
  const categoryName = useMemo(() => {
    if (!item) return '';
    return CATEGORIES.find(c => c.id === item.category)?.name || item.category;
  }, [item]);

  const colorName = useMemo(() => {
    if (!item) return '';
    const colorMap: Record<string, string> = {
      '#1a1a1a': 'Preto',
      '#ffffff': 'Branco',
      '#808080': 'Cinza',
      '#dc2626': 'Vermelho',
      '#ea580c': 'Laranja',
      '#ca8a04': 'Amarelo',
      '#16a34a': 'Verde',
      '#2563eb': 'Azul',
      '#9333ea': 'Roxo',
      '#db2777': 'Rosa',
      '#92400e': 'Marrom',
      '#d4a574': 'Bege',
    };
    return colorMap[item.color] || 'Personalizado';
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
              {item.image ? (
                <motion.img 
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Tag className="w-24 h-24 text-gray-300" />
                </div>
              )}
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
                <p className="text-gray-500 mt-1">{categoryName}</p>
              </motion.div>

              {/* Details Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Palette className="w-5 h-5 text-[#E88C44] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Cor</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-sm">{colorName}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Ruler className="w-5 h-5 text-[#E88C44] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Tamanho</p>
                  <p className="font-medium text-sm">{item.size}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-[#E88C44] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Adicionado</p>
                  <p className="font-medium text-sm">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </motion.div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3"
              >
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-gray-200"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={onDelete}
                    variant="destructive"
                    className="flex-1 h-12 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Excluir
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
