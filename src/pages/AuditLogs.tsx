
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AuditLogsScreen from '@/components/AuditLogs';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';

const AuditLogsPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only admin can access this page
    if (!user || user.role !== TipoUsuario.ADMIN) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== TipoUsuario.ADMIN) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main 
        className="container mx-auto py-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AuditLogsScreen />
      </motion.main>
    </div>
  );
};

export default AuditLogsPage;
