
import React, { useState } from 'react';
import { Order, orderHistory } from '@/data/orderHistory';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileText, Circle } from 'lucide-react';

const OrderHistory: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistory.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>
                  {formatDistanceToNow(parseISO(order.date), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(order.status)} text-white`}
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Pedido</SheetTitle>
            <SheetDescription>
              Pedido {selectedOrder?.id} • {selectedOrder?.date && formatDistanceToNow(parseISO(selectedOrder.date), { addSuffix: true, locale: ptBR })}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Status</h4>
              <div className="flex items-center space-x-2">
                <Circle className={`h-3 w-3 ${getStatusColor(selectedOrder?.status || '')}`} />
                <span className="font-medium">{getStatusLabel(selectedOrder?.status || '')}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Cliente</h4>
              <p>{selectedOrder?.userName}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Itens</h4>
              <ul className="space-y-2">
                {selectedOrder?.items.map((orderItem, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{orderItem.quantity}x {orderItem.item.name}</span>
                    <span>R$ {(orderItem.item.price * orderItem.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>R$ {selectedOrder?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <SheetClose asChild>
            <Button className="w-full mt-6" variant="outline">
              Fechar
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderHistory;
