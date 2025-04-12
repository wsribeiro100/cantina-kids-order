
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string>('');
  
  // Generate random order ID
  useEffect(() => {
    const randomOrderId = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(randomOrderId);
  }, []);
  
  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      navigate('/catalog');
    }
  }, [user, cart, navigate]);

  const handleNewOrder = () => {
    clearCart();
    navigate('/catalog');
  };
  
  if (!user || cart.length === 0) return null;

  // Calculate estimated pickup time (current time + 15 minutes)
  const pickupTime = new Date();
  pickupTime.setMinutes(pickupTime.getMinutes() + 15);
  
  const formattedPickupTime = pickupTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-6 border-4 border-kid-green">
            <CheckCircle className="h-20 w-20 text-kid-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h1>
            <p className="text-gray-600 mb-4">
              Seu pedido foi recebido e está sendo preparado.
            </p>
            
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-kid-green font-medium mb-1">Número do Pedido:</p>
              <p className="text-2xl font-bold"># {orderId}</p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-gray-700 mb-6">
              <Clock className="h-5 w-5" />
              <p>Retirada estimada: <span className="font-bold">{formattedPickupTime}</span></p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Resumo do Pedido:</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.item.name}
                    </span>
                    <span className="font-medium">
                      R$ {(item.item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-kid-green">R$ {getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-kid-blue mb-2">Instruções para retirada:</h3>
              <p className="text-sm text-gray-600">
                Dirija-se ao balcão da cantina e informe o número do seu pedido.
              </p>
            </div>
            
            <Button 
              onClick={handleNewOrder} 
              className="kid-button-primary w-full"
            >
              Fazer Novo Pedido
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
