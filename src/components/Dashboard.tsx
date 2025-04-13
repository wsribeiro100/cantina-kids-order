
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { CalendarDays, CreditCard, ShoppingBag, Bell } from 'lucide-react';
import { orderHistory } from '@/data/orderHistory';
import { mockTransactions } from '@/model/Transaction/Transaction';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Filter transactions and orders for current user
  const userTransactions = mockTransactions.filter(tx => tx.userId === user?.id);
  const userOrders = orderHistory.filter(order => order.userId === user?.id);
  
  // Calculate balance and recent activity
  const balance = user?.balance || 0;
  const recentOrders = userOrders.slice(0, 3);
  const pendingOrders = userOrders.filter(order => order.status === 'pending');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Disponível</p>
              <h3 className="text-2xl font-bold">R$ {balance.toFixed(2)}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Button 
            onClick={() => navigate('/wallet')} 
            variant="outline" 
            className="mt-4 w-full"
          >
            Ver Carteira
          </Button>
        </Card>

        {/* Orders Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos Recentes</p>
              <h3 className="text-2xl font-bold">{recentOrders.length}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Button 
            onClick={() => navigate('/order-history')} 
            variant="outline" 
            className="mt-4 w-full"
          >
            Ver Histórico
          </Button>
        </Card>

        {/* Pending Orders Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
              <h3 className="text-2xl font-bold">{pendingOrders.length}</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <CalendarDays className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <Button 
            onClick={() => navigate('/order-history')} 
            variant="outline" 
            className="mt-4 w-full"
            disabled={pendingOrders.length === 0}
          >
            {pendingOrders.length > 0 ? 'Ver Pendentes' : 'Nenhum pendente'}
          </Button>
        </Card>

        {/* Notifications Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Notificações</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
          >
            Ver Notificações
          </Button>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Pedido #{order.id.split('-')[1]}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                  <p className={`text-sm ${
                    order.status === 'completed' ? 'text-green-600' : 
                    order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {order.status === 'completed' ? 'Entregue' : 
                     order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">Nenhum pedido recente</p>
          )}
        </div>
        {recentOrders.length > 0 && (
          <Button 
            onClick={() => navigate('/order-history')}
            variant="link" 
            className="w-full mt-2"
          >
            Ver todos os pedidos
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
