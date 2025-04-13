
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OrderTrackingScreen from '@/components/OrderTracking';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';

const OrderTrackingPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only admin and staff can access this page
    if (!user || (user.role !== TipoUsuario.ADMIN && user.role !== TipoUsuario.STAFF)) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || (user.role !== TipoUsuario.ADMIN && user.role !== TipoUsuario.STAFF)) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main 
        className="container mx-auto py-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <OrderTrackingScreen />
      </motion.main>
    </div>
  );
};

export default OrderTrackingPage;
