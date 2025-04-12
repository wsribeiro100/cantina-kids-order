
import React from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/foodItems';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`rounded-full px-4 py-1 whitespace-nowrap ${
              selectedCategory === category.id 
                ? 'bg-kid-blue text-white' 
                : 'border-kid-blue text-kid-blue hover:bg-kid-blue/10'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
