import { motion } from 'framer-motion';
import type { ClothingItem } from '@/types';
import { Tag, X } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: () => void;
  onDelete?: () => void;
  delay?: number;
  isSelected?: boolean;
}

export function ClothingCard({ item, onClick, onDelete, delay = 0, isSelected = false }: ClothingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 30 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative bg-white rounded-2xl overflow-hidden cursor-pointer
        ios-card group
        ${isSelected ? 'ring-2 ring-[#E88C44] ring-offset-2' : ''}
      `}
      style={{ perspective: '1000px' }}
    >
      {/* Image Container */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Tag className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Delete Button */}
        {onDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}

        {/* Color Indicator */}
        <div 
          className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
          style={{ backgroundColor: item.color }}
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.size} • {item.category}</p>
        
        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <span 
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
