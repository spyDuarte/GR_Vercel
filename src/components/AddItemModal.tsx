import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Tag as TagIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClothingItem, Category } from '@/types';
import { CATEGORIES, COLORS, SIZES } from '@/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
}

export function AddItemModal({ isOpen, onClose, onSave }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('camisetas');
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState('M');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleAddTag = useCallback(() => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  }, [currentTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      category,
      color,
      size,
      image,
      tags,
    });

    // Reset form
    setName('');
    setCategory('camisetas');
    setColor(COLORS[0].value);
    setSize('M');
    setImage('');
    setTags([]);
    onClose();
  }, [name, category, color, size, image, tags, onSave, onClose]);

  const handleClose = useCallback(() => {
    setName('');
    setCategory('camisetas');
    setColor(COLORS[0].value);
    setSize('M');
    setImage('');
    setTags([]);
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
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Nova Peça</h2>
              <button 
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative aspect-video rounded-2xl border-2 border-dashed cursor-pointer
                  flex flex-col items-center justify-center gap-3
                  transition-all duration-300
                  ${isDragging 
                    ? 'border-[#E88C44] bg-orange-50' 
                    : image 
                      ? 'border-transparent' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {image ? (
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Toque para adicionar foto</p>
                      <p className="text-xs text-gray-500 mt-1">ou arraste uma imagem</p>
                    </div>
                  </>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome da peça
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Camiseta Branca Básica"
                  className="h-12 rounded-xl border-gray-200 focus:border-[#E88C44] focus:ring-[#E88C44]/20"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Categoria</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all
                        ${category === cat.id
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

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className={`
                        w-10 h-10 rounded-full border-2 transition-all
                        ${color === c.value ? 'border-gray-800 scale-110' : 'border-transparent'}
                      `}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tamanho</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${size === s
                          ? 'bg-[#E88C44] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Adicionar tag..."
                    className="h-12 rounded-xl border-gray-200 focus:border-[#E88C44] focus:ring-[#E88C44]/20"
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="outline"
                    className="h-12 px-4 rounded-xl border-gray-200"
                  >
                    <TagIcon className="w-5 h-5" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full h-14 rounded-xl bg-[#E88C44] hover:bg-[#d67a33] text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5 mr-2" />
                Salvar Peça
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
