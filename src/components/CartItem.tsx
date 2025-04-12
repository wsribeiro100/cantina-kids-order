
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, image }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0 border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-sm font-medium">{name}</h3>
          <p className="text-kid-green font-bold">R$ {price.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-kid-blue"
          onClick={() => updateQuantity(id, quantity - 1)}
        >
          <Minus className="h-4 w-4 text-kid-blue" />
        </Button>
        
        <span className="w-6 text-center">{quantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-kid-blue"
          onClick={() => updateQuantity(id, quantity + 1)}
        >
          <Plus className="h-4 w-4 text-kid-blue" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-100"
          onClick={() => removeFromCart(id)}
        >
          <Trash2 className="h-4 w-4 text-kid-red" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
