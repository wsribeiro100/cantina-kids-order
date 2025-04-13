
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';
import AdminSidebar from '@/components/AdminSidebar';

const ReportsPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Apenas admin pode acessar
    if (!user || user.role !== TipoUsuario.ADMIN) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== TipoUsuario.ADMIN) return null;
  
  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gray-50">
        <motion.main 
          className="container mx-auto py-6 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-kid-blue mb-6">Relatórios</h1>
          <div>
            {/* Conteúdo dos relatórios será adicionado posteriormente */}
            <p>Página de Relatórios em desenvolvimento</p>
          </div>
        </motion.main>
      </div>
    </AdminSidebar>
  );
};

export default ReportsPage;
