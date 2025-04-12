
import React from 'react';
import { FoodItem, useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface FoodCardProps {
  food: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="kid-card h-full flex flex-col">
        <CardHeader className="p-4">
          <div className="w-full aspect-square overflow-hidden rounded-xl mb-2">
            <img 
              src={food.image} 
              alt={food.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-lg font-bold text-center text-kid-blue">{food.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-gray-600">{food.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-kid-green font-bold">R$ {food.price.toFixed(2)}</p>
          <Button 
            onClick={() => addToCart(food)}
            className="rounded-full p-2 bg-kid-blue hover:bg-blue-600"
          >
            <PlusCircle size={20} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FoodCard;
