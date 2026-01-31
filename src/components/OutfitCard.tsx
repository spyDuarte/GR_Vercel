import { motion } from 'framer-motion';
import type { Outfit, ClothingItem } from '@/types';
import { Calendar, Layers, X } from 'lucide-react';

interface OutfitCardProps {
  outfit: Outfit;
  items: ClothingItem[];
  onClick?: () => void;
  onDelete?: () => void;
  delay?: number;
}

export function OutfitCard({ outfit, items, onClick, onDelete, delay = 0 }: OutfitCardProps) {
  const displayItems = items.slice(0, 4);
  const remainingCount = items.length - 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer ios-card group"
    >
      {/* Thumbnail Grid */}
      <div className="aspect-square p-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-2 h-full">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + idx * 0.1 }}
              className="relative rounded-xl overflow-hidden bg-white"
            >
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Layers className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Fill empty slots */}
          {Array.from({ length: Math.max(0, 4 - displayItems.length) }).map((_, idx) => (
            <div 
              key={`empty-${idx}`}
              className="rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Layers className="w-6 h-6 text-gray-200" />
            </div>
          ))}

          {/* Remaining count overlay */}
          {remainingCount > 0 && (
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#E88C44] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">
                {new Date(outfit.createdAt).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            <Layers className="w-4 h-4" />
            <span className="text-sm">{items.length}</span>
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
