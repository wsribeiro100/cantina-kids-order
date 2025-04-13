
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { foodItems } from '@/data/foodItems';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchableCombobox } from '@/components/ui/SearchableCombobox'

const CatalogoFunc: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(foodItems);

  
  const [students, setStudents] = useState([
    { value: 1, label: 'João Silva 1º Ano' },
    { value: 2, label: 'Maria Santos 2º Ano' },
    { value: 3, label: 'Pedro Oliveira 3º Ano' },
    { value: 4, label: 'Ana Costa 5º Ano' },
    { value: 5, label: 'Lucas Pereira 5º Ano' }
  ]);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Olá, {user.name}!
          </h1>
          <p className="text-gray-600">
            O que você gostaria de pedir hoje?
          </p>
        </motion.div>        
        <div className="mb-12">
        <SearchableCombobox
            items={students}
            value={selectedStudent}
            onChange={setSelectedStudent}
            placeholder="Selecione um aluno"
        />
        </div>
        
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
      </main>
    </div>
  );
};

export default CatalogoFunc;
