
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CheckoutPage from '@/components/CheckoutPage';

const Checkout: React.FC = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in or cart is empty
    if (!user) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate('/catalog');
    }
  }, [user, cart, navigate]);
  
  if (!user || cart.length === 0) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main 
        className="container mx-auto py-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CheckoutPage />
      </motion.main>
    </div>
  );
};

export default Checkout;
