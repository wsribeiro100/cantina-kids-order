
import React, { useMemo } from 'react';
import { orderHistory } from '@/data/orderHistory';
import { BarChart, LineChart, ResponsiveContainer, Tooltip, Bar, XAxis, YAxis, CartesianGrid, Line } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp } from 'lucide-react';

const FinancialReport: React.FC = () => {
  const today = new Date();
  
  // Calculate totals
  const totalRevenue = useMemo(() => 
    orderHistory
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0),
    []
  );
  
  const totalOrders = useMemo(() => 
    orderHistory.filter(order => order.status === 'completed').length,
    []
  );
  
  const averageOrderValue = useMemo(() => 
    totalOrders > 0 ? totalRevenue / totalOrders : 0,
    [totalRevenue, totalOrders]
  );
  
  // Prepare data for charts
  const revenueByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      const dayRevenue = orderHistory
        .filter(order => 
          order.status === 'completed' && 
          format(parseISO(order.date), 'yyyy-MM-dd') === dateString
        )
        .reduce((sum, order) => sum + order.total, 0);
        
      return {
        date: format(date, 'dd/MM', { locale: ptBR }),
        revenue: dayRevenue
      };
    });
    
    return days;
  }, []);
  
  const revenueByCategory = useMemo(() => {
    const categories = new Map();
    
    orderHistory
      .filter(order => order.status === 'completed')
      .forEach(order => {
        order.items.forEach(item => {
          const category = item.item.category;
          const amount = item.item.price * item.quantity;
          
          if (categories.has(category)) {
            categories.set(category, categories.get(category) + amount);
          } else {
            categories.set(category, amount);
          }
        });
      });
      
    return Array.from(categories.entries()).map(([category, value]) => ({
      category,
      revenue: value
    }));
  }, []);
  
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'sanduiches': 'Sanduíches',
      'bebidas': 'Bebidas',
      'frutas': 'Frutas',
      'lanches': 'Lanches',
      'pratos': 'Pratos Quentes',
      'sobremesas': 'Sobremesas'
    };
    
    return categoryMap[categoryId] || categoryId;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +2.5% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +0.2% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatório Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-6">
              <TabsTrigger value="revenue">Receita por Dia</TabsTrigger>
              <TabsTrigger value="category">Receita por Categoria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="h-[300px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "#8B5CF6",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueByDay}>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value}`}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <Tooltip
                      content={({active, payload}) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Data
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].payload.date}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Receita
                                </span>
                                <span className="font-bold">
                                  R$ {payload[0].value.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="category" className="h-[300px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "#8B5CF6",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByCategory}>
                    <XAxis 
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={getCategoryName}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value}`}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <Tooltip
                      content={({active, payload}) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Categoria
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {getCategoryName(payload[0].payload.category)}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Receita
                                </span>
                                <span className="font-bold">
                                  R$ {payload[0].value.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
