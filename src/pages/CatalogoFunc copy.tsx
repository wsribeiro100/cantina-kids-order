import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { foodItems } from '@/data/foodItems';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Mock de alunos para demonstração
const students = [
  { id: '1', name: 'João Silva', class: '5º Ano A' },
  { id: '2', name: 'Maria Oliveira', class: '4º Ano B' },
  { id: '3', name: 'Pedro Santos', class: '5º Ano A' },
  { id: '4', name: 'Ana Beatriz', class: '3º Ano C' },
  { id: '5', name: 'Lucas Mendes', class: '4º Ano A' },
  { id: '6', name: 'Isabela Costa', class: '3º Ano B' },
  { id: '7', name: 'Gabriel Ferreira', class: '5º Ano B' },
  { id: '8', name: 'Sofia Rodrigues', class: '4º Ano C' },
  { id: '9', name: 'Miguel Alves', class: '3º Ano A' },
  { id: '10', name: 'Valentina Lima', class: '5º Ano C' },
];

const CatalogoFunc: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(foodItems);

  // Redirecionar se não for funcionário
  React.useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Filter items based on category and search query
  useEffect(() => {
    let filtered = foodItems;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-kid-blue mb-6">Catálogo - Área do Funcionário</h1>
        
        <div className="flex flex-col space-y-4 max-w-md mb-6">
          <label className="text-sm font-medium text-gray-700">Selecione o Aluno</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between text-left font-normal"
              >
                {selectedStudent || "Buscar aluno..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full min-w-[300px]">
              <Command>
                <CommandInput placeholder="Digite o nome do aluno..." />
                <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {students.map((student) => (
                    <CommandItem
                      key={student.id}
                      value={student.name}
                      onSelect={(currentValue) => {
                        setSelectedStudent(currentValue === selectedStudent ? null : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedStudent === student.name ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.class}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedStudent && (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Procurar comidas e bebidas..."
                className="rounded-full pl-10 text-base border-2 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
            </div>
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum item encontrado para esta pesquisa.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} food={item} />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CatalogoFunc;