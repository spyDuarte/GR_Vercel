import { motion } from 'framer-motion';
import { Home, Grid3X3, Sparkles, User } from 'lucide-react';

type Tab = 'home' | 'categories' | 'outfits' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'home' as Tab, label: 'Início', icon: Home },
  { id: 'categories' as Tab, label: 'Categorias', icon: Grid3X3 },
  { id: 'outfits' as Tab, label: 'Looks', icon: Sparkles },
  { id: 'profile' as Tab, label: 'Perfil', icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-40">
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center py-2 px-4"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#E88C44]' : 'text-gray-400'
                  }`} 
                />
              </motion.div>
              
              <span 
                className={`text-xs mt-1 font-medium transition-colors ${
                  isActive ? 'text-[#E88C44]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-[#E88C44] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
