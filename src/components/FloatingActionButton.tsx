import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ onClick, label }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay: 0.5
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#E88C44] text-white px-6 py-4 rounded-full shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-shadow"
    >
      <Plus className="w-6 h-6" />
      {label && <span className="font-medium pr-1">{label}</span>}
    </motion.button>
  );
}
