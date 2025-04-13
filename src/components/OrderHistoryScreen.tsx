
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { orderHistory, Order } from '@/data/orderHistory';
import { Search, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OrderHistoryScreen: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter orders for the current user
  const userOrders = user ? 
    orderHistory.filter(order => order.userId === user.id) : 
    [];
  
  // Apply filters
  const filteredOrders = userOrders.filter(order => {
    // Apply search filter
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Apply status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Entregue';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-kid-blue">Histórico de Pedidos</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-auto"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Entregues</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" /> 
            {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
          </Button>
        </div>
      </div>
      
      {sortedOrders.length > 0 ? (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </Card>
      )}
    </div>
  );
};

const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formattedDate = format(new Date(order.date), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Entregue';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Pedido #{order.id.split('-')[1]}</span>
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-slate-50 border-t">
          <h3 className="text-sm font-medium mb-2">Itens do Pedido</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded overflow-hidden">
                    <img 
                      src={item.item.image} 
                      alt={item.item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x R$ {item.item.price.toFixed(2)}</p>
                  </div>
                </div>
                <p className="font-medium">R$ {(item.quantity * item.item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t flex justify-between">
            <p className="font-medium">Total do Pedido</p>
            <p className="font-bold">R$ {order.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderHistoryScreen;
