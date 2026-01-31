import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  delay?: number;
}

export function StatCard({ icon: Icon, value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="bg-white rounded-2xl p-4 ios-card flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E88C44] to-[#d67a33] flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-2xl font-bold text-gray-800"
        >
          {value}
        </motion.p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}
