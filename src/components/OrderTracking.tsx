
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Clock, CheckCircle2, XCircle, Search, Filter, 
  List, Grid3X3, User, ChevronDown, ChevronUp, 
  ShoppingCart
} from 'lucide-react';
import { orderHistory } from '@/data/orderHistory';

// Order status type
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'completed';

// Extended Order interface with tracking information
interface TrackingOrder {
  id: string;
  customerId: string;
  customerName: string;
  date: Date;
  items: {
    item: {
      id: number;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  assignedTo?: string;
  preparationStartTime?: Date;
  preparationEndTime?: Date;
  deliveryTime?: Date;
  completionTime?: Date;
  notes?: string;
}

// Transform orderHistory data to tracking orders
const initialOrders: TrackingOrder[] = orderHistory.map(order => ({
  ...order,
  date: new Date(order.date),
  status: order.status as OrderStatus,
  // Add random preparation and delivery times for some orders
  ...(Math.random() > 0.3 ? {
    preparationStartTime: new Date(new Date(order.date).getTime() + Math.random() * 10 * 60000),
  } : {}),
  ...(Math.random() > 0.5 ? {
    preparationEndTime: new Date(new Date(order.date).getTime() + Math.random() * 20 * 60000),
  } : {}),
  ...(Math.random() > 0.7 ? {
    deliveryTime: new Date(new Date(order.date).getTime() + Math.random() * 30 * 60000),
  } : {}),
  ...(order.status === 'completed' ? {
    completionTime: new Date(new Date(order.date).getTime() + Math.random() * 35 * 60000),
  } : {})
}));

const OrderTrackingScreen: React.FC = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [detailsOrder, setDetailsOrder] = useState<TrackingOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter(order => {
    // First filter by tab
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }
    
    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.item.name.toLowerCase().includes(query) ||
          item.item.description.toLowerCase().includes(query)
        )
      );
    }
    
    return true;
  });
  
  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const now = new Date();
        const updatedOrder: TrackingOrder = {
          ...order,
          status: newStatus,
        };
        
        // Add appropriate timestamps based on the new status
        if (newStatus === 'preparing' && !updatedOrder.preparationStartTime) {
          updatedOrder.preparationStartTime = now;
        } else if (newStatus === 'ready' && !updatedOrder.preparationEndTime) {
          updatedOrder.preparationEndTime = now;
        } else if (newStatus === 'delivered' && !updatedOrder.deliveryTime) {
          updatedOrder.deliveryTime = now;
        } else if ((newStatus === 'completed' || newStatus === 'cancelled') && !updatedOrder.completionTime) {
          updatedOrder.completionTime = now;
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Show toast notification
    toast({
      title: 'Status atualizado',
      description: `Pedido #${orderId} foi atualizado para: ${getStatusLabel(newStatus)}`,
    });
  };
  
  // View order details
  const viewOrderDetails = (order: TrackingOrder) => {
    setDetailsOrder(order);
    setShowDetails(true);
  };
  
  // Toggle row expanded state
  const toggleRowExpanded = (orderId: string) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };
  
  // Get badge color based on order status
  const getStatusBadgeColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'ready':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Get label based on order status
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'Aguardando';
      case 'preparing':
        return 'Em preparo';
      case 'ready':
        return 'Pronto';
      case 'delivered':
        return 'Entregue';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  // Get icon based on order status
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Calculate order preparation time if available
  const getPreparationTime = (order: TrackingOrder): string => {
    if (order.preparationStartTime && order.preparationEndTime) {
      const diffMs = order.preparationEndTime.getTime() - order.preparationStartTime.getTime();
      const diffMins = Math.round(diffMs / 60000);
      return `${diffMins} min`;
    }
    
    return 'N/A';
  };
  
  // Get available status transitions based on current status
  const getAvailableStatusTransitions = (status: OrderStatus): OrderStatus[] => {
    switch (status) {
      case 'pending':
        return ['preparing', 'cancelled'];
      case 'preparing':
        return ['ready', 'cancelled'];
      case 'ready':
        return ['delivered', 'cancelled'];
      case 'delivered':
        return ['completed'];
      default:
        return [];
    }
  };
  
  // Count orders by status
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    ready: orders.filter(order => order.status === 'ready').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    completed: orders.filter(order => order.status === 'completed').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Acompanhamento de Pedidos</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card
          className={`${activeTab === 'pending' ? 'border-amber-400 bg-amber-50' : ''} 
          transition-colors cursor-pointer hover:border-amber-400 hover:bg-amber-50`}
          onClick={() => setActiveTab('pending')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Aguardando
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.pending}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card
          className={`${activeTab === 'preparing' ? 'border-blue-400 bg-blue-50' : ''} 
          transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50`}
          onClick={() => setActiveTab('preparing')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Em Preparo
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.preparing}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card
          className={`${activeTab === 'ready' ? 'border-purple-400 bg-purple-50' : ''} 
          transition-colors cursor-pointer hover:border-purple-400 hover:bg-purple-50`}
          onClick={() => setActiveTab('ready')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Pronto
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.ready}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card
          className={`${activeTab === 'delivered' ? 'border-indigo-400 bg-indigo-50' : ''} 
          transition-colors cursor-pointer hover:border-indigo-400 hover:bg-indigo-50`}
          onClick={() => setActiveTab('delivered')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Entregue
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.delivered}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card
          className={`${activeTab === 'completed' ? 'border-green-400 bg-green-50' : ''} 
          transition-colors cursor-pointer hover:border-green-400 hover:bg-green-50`}
          onClick={() => setActiveTab('completed')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Concluído
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.completed}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card
          className={`${activeTab === 'all' ? 'border-gray-400 bg-gray-50' : ''} 
          transition-colors cursor-pointer hover:border-gray-400 hover:bg-gray-50`}
          onClick={() => setActiveTab('all')}
        >
          <CardHeader className="py-4 px-4">
            <CardTitle className="text-base font-medium flex justify-between items-center">
              Todos
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                {orderCounts.all}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pedidos por ID, cliente ou item..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className={viewMode === 'list' ? 'bg-gray-100' : ''}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={viewMode === 'cards' ? 'bg-gray-100' : ''}
            onClick={() => setViewMode('cards')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredOrders.length > 0 ? (
        viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tempo de Preparo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow
                      className={selectedOrderId === order.id ? 'bg-gray-50' : ''}
                      onClick={() => toggleRowExpanded(order.id)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        {format(order.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {order.customerName}
                        </div>
                      </TableCell>
                      <TableCell>{order.items.length} itens</TableCell>
                      <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline" 
                          className={`${getStatusBadgeColor(order.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPreparationTime(order)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewOrderDetails(order);
                            }}
                          >
                            Detalhes
                          </Button>
                          {selectedOrderId === order.id ? (
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {selectedOrderId === order.id && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Itens do Pedido</h4>
                              <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <li 
                                    key={idx} 
                                    className="flex justify-between border-b border-gray-100 pb-2"
                                  >
                                    <span>
                                      {item.quantity}x {item.item.name}
                                    </span>
                                    <span className="text-gray-600">
                                      R$ {(item.item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 font-medium flex justify-between">
                                <span>Total:</span>
                                <span>R$ {order.total.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Acompanhamento</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Pedido recebido:</span>
                                  <span>{format(order.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                </div>
                                
                                {order.preparationStartTime && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Início do preparo:</span>
                                    <span>
                                      {format(order.preparationStartTime, "HH:mm", { locale: ptBR })}
                                    </span>
                                  </div>
                                )}
                                
                                {order.preparationEndTime && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Preparo finalizado:</span>
                                    <span>
                                      {format(order.preparationEndTime, "HH:mm", { locale: ptBR })}
                                    </span>
                                  </div>
                                )}
                                
                                {order.deliveryTime && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Entregue:</span>
                                    <span>
                                      {format(order.deliveryTime, "HH:mm", { locale: ptBR })}
                                    </span>
                                  </div>
                                )}
                                
                                {order.completionTime && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Finalizado:</span>
                                    <span>
                                      {format(order.completionTime, "HH:mm", { locale: ptBR })}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {order.notes && (
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Observações</h4>
                                  <p className="text-gray-600">{order.notes}</p>
                                </div>
                              )}
                              
                              {getAvailableStatusTransitions(order.status).length > 0 && (
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Atualizar Status</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {getAvailableStatusTransitions(order.status).map((status) => (
                                      <Button
                                        key={status}
                                        variant="outline"
                                        size="sm"
                                        className={`${getStatusBadgeColor(status)}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateOrderStatus(order.id, status);
                                        }}
                                      >
                                        {getStatusLabel(status)}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                    <Badge
                      variant="outline" 
                      className={`${getStatusBadgeColor(order.status)} flex items-center gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-wrap justify-between">
                    <span>
                      {format(order.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                    <span className="font-medium">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{order.customerName}</span>
                      </div>
                      
                      <div className="space-y-1 max-h-32 overflow-auto">
                        <h4 className="text-sm font-medium">Itens:</h4>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span>{item.quantity}x {item.item.name}</span>
                            <span>R$ {(item.item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm text-gray-500 italic">
                            + {order.items.length - 3} outros itens
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {getAvailableStatusTransitions(order.status).length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {getAvailableStatusTransitions(order.status).map((status) => (
                            <Button
                              key={status}
                              variant="outline"
                              size="sm"
                              className={`${getStatusBadgeColor(status)}`}
                              onClick={() => updateOrderStatus(order.id, status)}
                            >
                              {getStatusLabel(status)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full"
                      onClick={() => viewOrderDetails(order)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-1">Nenhum pedido encontrado</h3>
          <p className="text-gray-500 text-center">
            {searchQuery 
              ? 'Tente ajustar seus filtros de busca.' 
              : 'Não há pedidos para exibir nesta categoria.'}
          </p>
        </div>
      )}
      
      {/* Order Detail Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          {detailsOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Detalhes do Pedido #{detailsOrder.id}</span>
                  <Badge
                    variant="outline" 
                    className={`${getStatusBadgeColor(detailsOrder.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(detailsOrder.status)}
                    {getStatusLabel(detailsOrder.status)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Pedido realizado em {format(detailsOrder.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informações do Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{detailsOrder.customerName}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mt-6 mb-3">Itens do Pedido</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {detailsOrder.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between py-2 border-b last:border-0 border-gray-200"
                      >
                        <div>
                          <div className="font-medium">{item.item.name}</div>
                          <div className="text-sm text-gray-500">{item.quantity} x R$ {item.item.price.toFixed(2)}</div>
                        </div>
                        <div className="font-medium">
                          R$ {(item.item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between pt-4 mt-2 font-bold">
                      <span>Total:</span>
                      <span>R$ {detailsOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Status do Pedido</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500 rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Pedido recebido</span>
                          <span className="text-xs text-gray-500">
                            {format(detailsOrder.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-2.5 w-0.5 h-8 bg-gray-200 self-start" />
                      
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center 
                          ${detailsOrder.preparationStartTime ? 'bg-green-500' : 'bg-gray-200'}`}>
                          {detailsOrder.preparationStartTime 
                            ? <CheckCircle2 className="h-3 w-3 text-white" /> 
                            : <Clock className="h-3 w-3 text-gray-400" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Em preparação</span>
                          {detailsOrder.preparationStartTime && (
                            <span className="text-xs text-gray-500">
                              {format(detailsOrder.preparationStartTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-2.5 w-0.5 h-8 bg-gray-200 self-start" />
                      
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center 
                          ${detailsOrder.preparationEndTime ? 'bg-green-500' : 'bg-gray-200'}`}>
                          {detailsOrder.preparationEndTime 
                            ? <CheckCircle2 className="h-3 w-3 text-white" /> 
                            : <Clock className="h-3 w-3 text-gray-400" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Pronto para entrega</span>
                          {detailsOrder.preparationEndTime && (
                            <span className="text-xs text-gray-500">
                              {format(detailsOrder.preparationEndTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-2.5 w-0.5 h-8 bg-gray-200 self-start" />
                      
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center 
                          ${detailsOrder.deliveryTime || detailsOrder.completionTime ? 'bg-green-500' : 'bg-gray-200'}`}>
                          {detailsOrder.deliveryTime || detailsOrder.completionTime
                            ? <CheckCircle2 className="h-3 w-3 text-white" /> 
                            : <Clock className="h-3 w-3 text-gray-400" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Entregue ao cliente</span>
                          {detailsOrder.deliveryTime && (
                            <span className="text-xs text-gray-500">
                              {format(detailsOrder.deliveryTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {(detailsOrder.status === 'completed' || detailsOrder.status === 'cancelled') && (
                        <>
                          <div className="ml-2.5 w-0.5 h-8 bg-gray-200 self-start" />
                          
                          <div className="flex items-center gap-4">
                            <div className={`rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center 
                              ${detailsOrder.completionTime 
                                ? detailsOrder.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500' 
                                : 'bg-gray-200'}`}>
                              {detailsOrder.completionTime 
                                ? detailsOrder.status === 'completed'
                                  ? <CheckCircle2 className="h-3 w-3 text-white" />
                                  : <XCircle className="h-3 w-3 text-white" />
                                : <Clock className="h-3 w-3 text-gray-400" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {detailsOrder.status === 'completed' ? 'Finalizado' : 'Cancelado'}
                              </span>
                              {detailsOrder.completionTime && (
                                <span className="text-xs text-gray-500">
                                  {format(detailsOrder.completionTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {detailsOrder.notes && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-900 mb-2">Observações</h3>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                          {detailsOrder.notes}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {getAvailableStatusTransitions(detailsOrder.status).length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-3">Atualizar Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableStatusTransitions(detailsOrder.status).map((status) => (
                          <Button
                            key={status}
                            className={`${getStatusBadgeColor(status)}`}
                            onClick={() => {
                              updateOrderStatus(detailsOrder.id, status);
                              setShowDetails(false);
                            }}
                          >
                            {getStatusLabel(status)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTrackingScreen;
