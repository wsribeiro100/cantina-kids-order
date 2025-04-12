
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, ArrowLeft, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;

  const handleCheckout = () => {
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/catalog')} 
            className="mr-2 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Seu Carrinho</h1>
        </div>
        
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingBasket className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-4">Seu carrinho está vazio</h2>
            <Button 
              onClick={() => navigate('/catalog')}
              className="kid-button-primary"
            >
              Ver Catálogo
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Itens do Pedido</h2>
                <Button 
                  variant="ghost" 
                  onClick={clearCart} 
                  className="text-kid-red hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <CartItem
                    key={item.item.id}
                    id={item.item.id}
                    name={item.item.name}
                    price={item.item.price}
                    quantity={item.quantity}
                    image={item.item.image}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-kid-green">R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                className="w-full kid-button-success text-lg"
              >
                Finalizar Pedido
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Cart;
