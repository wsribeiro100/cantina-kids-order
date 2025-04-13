
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import OrderHistory from '@/components/OrderHistory';
import FinancialReport from '@/components/FinancialReport';
import { ChartBarIcon, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } 
  }, [user, navigate]);
  
  if (!user || user.role !== 'staff') {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <motion.main 
        className="container mx-auto py-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Histórico de Pedidos
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <ChartBarIcon className="h-4 w-4" />
              Relatórios Financeiros
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
          
          <TabsContent value="reports">
            <FinancialReport />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
