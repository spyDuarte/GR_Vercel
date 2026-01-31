import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Layers, 
  TrendingUp,
  Settings,
  Search,
  Bell,
  Package,
  Plus,
  User,
  LogOut
} from 'lucide-react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useAuth } from '@/hooks/useAuth';
import type { Category, ClothingItem } from '@/types';
import { CATEGORIES } from '@/types';
import { BottomNav } from '@/components/BottomNav';
import { StatCard } from '@/components/StatCard';
import { CategoryPill } from '@/components/CategoryPill';
import { ClothingCard } from '@/components/ClothingCard';
import { OutfitCard } from '@/components/OutfitCard';
import { AddItemModal } from '@/components/AddItemModal';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { CreateOutfitModal } from '@/components/CreateOutfitModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'home' | 'categories' | 'outfits' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isCreateOutfitOpen, setIsCreateOutfitOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    signUp,
    signIn,
    signInGoogle,
    signInApple,
    logout,
  } = useAuth();

  const {
    items,
    outfits,
    stats,
    categoryCounts,
    addItem,
    deleteItem,
    addOutfit,
    deleteOutfit,
    getOutfitItems,
  } = useWardrobe();

  // Filtered items for display
  const filteredItems = useMemo(() => {
    let result = items;
    
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [items, selectedCategory, categoryFilter, searchQuery]);

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: categoryCounts[cat.id],
    }));
  }, [categoryCounts]);

  const handleAddItem = useCallback((item: Parameters<typeof addItem>[0]) => {
    addItem(item);
    setIsAddItemOpen(false);
  }, [addItem]);

  const handleCreateOutfit = useCallback((outfit: Parameters<typeof addOutfit>[0]) => {
    addOutfit(outfit);
    setIsCreateOutfitOpen(false);
  }, [addOutfit]);

  const handleDeleteItem = useCallback((itemId: string) => {
    if (confirm('Tem certeza que deseja excluir esta peça?')) {
      deleteItem(itemId);
      setSelectedItem(null);
    }
  }, [deleteItem]);

  const handleDeleteOutfit = useCallback((outfitId: string) => {
    if (confirm('Tem certeza que deseja excluir este look?')) {
      deleteOutfit(outfitId);
    }
  }, [deleteOutfit]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Show auth screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E88C44] via-[#d67a33] to-[#c46a28] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onSignIn={signIn}
        onSignUp={signUp}
        onGoogleSignIn={signInGoogle}
        onAppleSignIn={signInApple}
      />
    );
  }

  // Home Tab
  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-24"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-4 pt-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meu Guarda-Roupa</h1>
          <p className="text-gray-500 text-sm">Organize seu estilo</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3">
        <StatCard 
          icon={Package} 
          value={stats.totalItems} 
          label="Peças" 
          delay={0.1}
        />
        <StatCard 
          icon={Sparkles} 
          value={stats.totalOutfits} 
          label="Looks" 
          delay={0.2}
        />
        <StatCard 
          icon={TrendingUp} 
          value={stats.categoriesCount} 
          label="Categorias" 
          delay={0.3}
        />
      </div>

      {/* Categories */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Categorias</h2>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categoriesWithCounts.map((cat, idx) => (
            <CategoryPill
              key={cat.id}
              {...cat}
              isSelected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              delay={0.2 + idx * 0.05}
            />
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory ? 'Peças da Categoria' : 'Peças Recentes'}
          </h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-[#E88C44] font-medium"
            >
              Ver todas
            </button>
          )}
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.slice(0, 6).map((item, idx) => (
              <ClothingCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                delay={0.3 + idx * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma peça encontrada</p>
            <Button
              onClick={() => setIsAddItemOpen(true)}
              variant="outline"
              className="mt-3 rounded-xl border-[#E88C44] text-[#E88C44]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Peça
            </Button>
          </div>
        )}
      </div>

      {/* Recent Outfits */}
      {stats.totalOutfits > 0 && !selectedCategory && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Looks Recentes</h2>
            <button 
              onClick={() => setActiveTab('outfits')}
              className="text-sm text-[#E88C44] font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {outfits.slice(0, 2).map((outfit, idx) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                items={getOutfitItems(outfit.id)}
                onDelete={() => handleDeleteOutfit(outfit.id)}
                delay={0.4 + idx * 0.1}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // Categories Tab
  const renderCategories = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-24"
    >
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
        <p className="text-gray-500 text-sm">Explore por tipo de peça</p>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar peças..."
            className="h-12 pl-12 rounded-xl border-gray-200 focus:border-[#E88C44] focus:ring-[#E88C44]/20"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${categoryFilter === 'all'
                ? 'bg-[#E88C44] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Todas
          </button>
          {categoriesWithCounts.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${categoryFilter === cat.id
                  ? 'bg-[#E88C44] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, idx) => (
              <ClothingCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                delay={idx * 0.03}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma peça encontrada</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Tente uma busca diferente' : 'Adicione sua primeira peça'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Outfits Tab
  const renderOutfits = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-24"
    >
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">Meus Looks</h1>
        <p className="text-gray-500 text-sm">Combinações salvas</p>
      </div>

      {stats.totalOutfits > 0 ? (
        <div className="px-4 grid grid-cols-2 gap-4">
          {outfits.map((outfit, idx) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={getOutfitItems(outfit.id)}
              onDelete={() => handleDeleteOutfit(outfit.id)}
              delay={idx * 0.05}
            />
          ))}
        </div>
      ) : (
        <div className="px-4">
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum look criado</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Crie seu primeiro look combinando peças</p>
            <Button
              onClick={() => setIsCreateOutfitOpen(true)}
              className="rounded-xl bg-[#E88C44] hover:bg-[#d67a33]"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Criar Look
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );

  // Profile Tab
  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-24"
    >
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
        <p className="text-gray-500 text-sm">Suas informações</p>
      </div>

      {/* Profile Card */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#E88C44] to-[#d67a33] rounded-2xl p-6 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-center">
            {user?.name || user?.email?.split('@')[0] || 'Meu Estilo'}
          </h2>
          <p className="text-white/80 text-center text-sm mt-1">
            {user?.email || 'Guarda-Roupa Virtual'}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 space-y-3">
        <h3 className="font-semibold text-gray-800">Resumo</h3>
        
        <div className="bg-white rounded-xl p-4 ios-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#E88C44]" />
            </div>
            <span className="text-gray-700">Total de Peças</span>
          </div>
          <span className="text-xl font-bold text-gray-800">{stats.totalItems}</span>
        </div>

        <div className="bg-white rounded-xl p-4 ios-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#E88C44]" />
            </div>
            <span className="text-gray-700">Looks Criados</span>
          </div>
          <span className="text-xl font-bold text-gray-800">{stats.totalOutfits}</span>
        </div>

        <div className="bg-white rounded-xl p-4 ios-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#E88C44]" />
            </div>
            <span className="text-gray-700">Categorias</span>
          </div>
          <span className="text-xl font-bold text-gray-800">{stats.categoriesCount}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="px-4">
        <h3 className="font-semibold text-gray-800 mb-3">Por Categoria</h3>
        <div className="space-y-2">
          {categoriesWithCounts
            .filter(cat => cat.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl p-3 ios-card flex items-center justify-between">
                <span className="text-gray-700">{cat.name}</span>
                <span className="font-semibold text-[#E88C44]">{cat.count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-red-200 text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </motion.div>
  );

  // Show FAB only on categories and outfits tabs
  const showFab = activeTab === 'categories' || activeTab === 'outfits';

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'outfits' && renderOutfits()}
          {activeTab === 'profile' && renderProfile()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Action Button - Only on Categories and Looks tabs */}
      {showFab && (
        <FloatingActionButton 
          onClick={() => activeTab === 'outfits' ? setIsCreateOutfitOpen(true) : setIsAddItemOpen(true)}
          label={activeTab === 'outfits' ? 'Novo Look' : 'Nova Peça'}
        />
      )}

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSave={handleAddItem}
      />

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={() => selectedItem && handleDeleteItem(selectedItem.id)}
      />

      <CreateOutfitModal
        isOpen={isCreateOutfitOpen}
        onClose={() => setIsCreateOutfitOpen(false)}
        onSave={handleCreateOutfit}
        items={items}
      />
    </div>
  );
}

export default App;
