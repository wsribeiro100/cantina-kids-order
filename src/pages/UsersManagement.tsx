
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';
import AdminSidebar from '@/components/AdminSidebar';

const UsersManagementPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-kid-blue mb-6">Gerenciamento de Usuários</h1>
          <div>
            {/* Conteúdo do gerenciamento de usuários será adicionado posteriormente */}
            <p>Página de Gerenciamento de Usuários em desenvolvimento</p>
          </div>
        </motion.main>
      </div>
    </AdminSidebar>
  );
};

export default UsersManagementPage;
