import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '@/types';
import * as Icons from 'lucide-react';

interface CategoryPillProps {
  id: Category;
  name: string;
  icon: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Shirt: Icons.Shirt,
  Pants: Icons.AlignStartVertical,
  Sparkles: Icons.Sparkles,
  Footprints: Icons.Footprints,
  Gem: Icons.Gem,
  Zap: Icons.Zap,
  Triangle: Icons.Triangle,
};

export function CategoryPill({ name, icon, count, isSelected, onClick, delay = 0 }: CategoryPillProps) {
  const IconComponent = iconMap[icon] || Icons.Circle;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap
        transition-all duration-300 ease-out
        ${isSelected 
          ? 'bg-[#E88C44] text-white shadow-lg shadow-orange-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      <motion.div
        animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <IconComponent className="w-4 h-4" />
      </motion.div>
      <span className="font-medium text-sm">{name}</span>
      <motion.span
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`
          text-xs px-2 py-0.5 rounded-full
          ${isSelected ? 'bg-white/20' : 'bg-gray-200'}
        `}
      >
        {count}
      </motion.span>
    </motion.button>
  );
}
