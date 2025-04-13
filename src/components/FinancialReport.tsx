
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { orderHistory } from '@/data/orderHistory';
import { mockTransactions, TransactionType } from '@/model/Transaction/Transaction';

// Ensure toFixed is only called on numbers
const formatCurrency = (value: any) => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value;
};

const FinancialReport: React.FC = () => {
  // Calculate summary data
  const summaryData = useMemo(() => {
    const totalSales = orderHistory.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orderHistory.length;
    const completedOrders = orderHistory.filter(order => order.status === 'completed').length;
    const pendingOrders = orderHistory.filter(order => order.status === 'pending').length;
    const cancelledOrders = orderHistory.filter(order => order.status === 'cancelled').length;
    
    const deposits = mockTransactions
      .filter(tx => tx.type === TransactionType.DEPOSIT)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const purchases = mockTransactions
      .filter(tx => tx.type === TransactionType.PURCHASE)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const refunds = mockTransactions
      .filter(tx => tx.type === TransactionType.REFUND)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    return {
      totalSales,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      averageOrderValue: totalOrders ? totalSales / totalOrders : 0,
      deposits,
      purchases,
      refunds
    };
  }, []);
  
  // Prepare data for charts
  const dailySalesData = useMemo(() => {
    const salesByDate = orderHistory.reduce((acc: any, order) => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = {
          date,
          sales: 0,
          orders: 0
        };
      }
      acc[date].sales += order.total;
      acc[date].orders += 1;
      return acc;
    }, {});
    
    return Object.values(salesByDate);
  }, []);
  
  const categoryData = useMemo(() => {
    const salesByCategory = orderHistory.reduce((acc: any, order) => {
      order.items.forEach((item) => {
        const category = item.item.category;
        if (!acc[category]) {
          acc[category] = {
            name: category,
            value: 0
          };
        }
        acc[category].value += item.item.price * item.quantity;
      });
      return acc;
    }, {});
    
    return Object.values(salesByCategory);
  }, []);
  
  const statusData = useMemo(() => [
    { name: 'Concluídos', value: summaryData.completedOrders },
    { name: 'Pendentes', value: summaryData.pendingOrders },
    { name: 'Cancelados', value: summaryData.cancelledOrders }
  ], [summaryData]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const CATEGORY_COLORS = {
    bebidas: '#0088FE',
    sanduiches: '#00C49F',
    pratos: '#FFBB28',
    frutas: '#FF8042',
    sobremesas: '#8884D8'
  };
  
  const STATUS_COLORS = {
    Concluídos: '#00C49F',
    Pendentes: '#FFBB28',
    Cancelados: '#FF8042'
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Vendas Totais</h3>
          <p className="text-2xl font-bold">R$ {formatCurrency(summaryData.totalSales)}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total de Pedidos</h3>
          <p className="text-2xl font-bold">{summaryData.totalOrders}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Ticket Médio</h3>
          <p className="text-2xl font-bold">R$ {formatCurrency(summaryData.averageOrderValue)}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recargas</h3>
          <p className="text-2xl font-bold">R$ {formatCurrency(summaryData.deposits)}</p>
        </Card>
      </div>
      
      {/* Sales Trend Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-6">Tendência de Vendas Diárias</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value) => `R$ ${formatCurrency(value)}`} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              name="Vendas (R$)" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              name="Número de Pedidos" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Sales by Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-6">Vendas por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${formatCurrency(value)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Orders by Status Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-6">Pedidos por Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReport;
