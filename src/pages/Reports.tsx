
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';
import AdminSidebar from '@/components/AdminSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltipContent,
  ChartTooltip
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { 
  ChevronDownIcon, 
  LineChart, 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  Wallet,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

// Mock data for sales reports
const dailySalesData = [
  { name: 'Seg', vendas: 4000 },
  { name: 'Ter', vendas: 3000 },
  { name: 'Qua', vendas: 5000 },
  { name: 'Qui', vendas: 2780 },
  { name: 'Sex', vendas: 6890 },
];

const monthlySalesData = [
  { name: 'Jan', vendas: 40000 },
  { name: 'Fev', vendas: 35000 },
  { name: 'Mar', vendas: 52000 },
  { name: 'Abr', vendas: 27800 },
  { name: 'Mai', vendas: 68900 },
  { name: 'Jun', vendas: 50000 },
];

// Mock data for most sold items
const topSellingItemsData = [
  { name: 'Sanduíche de Queijo', value: 400 },
  { name: 'Suco de Laranja', value: 300 },
  { name: 'Maçã', value: 250 },
  { name: 'Iogurte de Morango', value: 200 },
  { name: 'Água Mineral', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data for inventory
const inventoryData = [
  { id: 1, name: 'Pão', quantity: 150, status: 'Em Estoque', lastUpdate: '14/04/2025' },
  { id: 2, name: 'Queijo', quantity: 80, status: 'Em Estoque', lastUpdate: '14/04/2025' },
  { id: 3, name: 'Presunto', quantity: 60, status: 'Em Estoque', lastUpdate: '13/04/2025' },
  { id: 4, name: 'Tomate', quantity: 25, status: 'Baixo Estoque', lastUpdate: '12/04/2025' },
  { id: 5, name: 'Alface', quantity: 30, status: 'Em Estoque', lastUpdate: '10/04/2025' },
  { id: 6, name: 'Suco de Laranja', quantity: 45, status: 'Em Estoque', lastUpdate: '14/04/2025' },
  { id: 7, name: 'Suco de Uva', quantity: 10, status: 'Baixo Estoque', lastUpdate: '11/04/2025' },
  { id: 8, name: 'Água Mineral', quantity: 200, status: 'Em Estoque', lastUpdate: '14/04/2025' },
];

// Mock data for student balances
const studentBalances = [
  { id: 1, name: 'João Silva', class: '5º Ano A', balance: 25.50, parent: 'Roberto Silva' },
  { id: 2, name: 'Maria Oliveira', class: '4º Ano B', balance: 15.75, parent: 'Ana Oliveira' },
  { id: 3, name: 'Pedro Santos', class: '5º Ano A', balance: 30.00, parent: 'Carlos Santos' },
  { id: 4, name: 'Ana Beatriz', class: '3º Ano C', balance: 5.25, parent: 'Joana Beatriz' },
  { id: 5, name: 'Lucas Mendes', class: '4º Ano A', balance: 45.00, parent: 'Márcia Mendes' },
];

const ReportsPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  
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
          <h1 className="text-4xl font-bold text-kid-blue mb-6">Relatórios</h1>
          
          <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> 
                <span className="font-bold">Vendas</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> 
                <span className="font-bold">Itens Mais Vendidos</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> 
                <span className="font-bold">Controle de Estoque</span>
              </TabsTrigger>
              <TabsTrigger value="balances" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" /> 
                <span className="font-bold">Saldos</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-kid-blue flex items-center gap-2">
                      <LineChart className="h-5 w-5" /> 
                      Vendas Diárias
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-600">
                      Visualização das vendas nos últimos dias
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ChartContainer 
                      config={{
                        vendas: {
                          label: "Vendas",
                          color: "#9b87f5"
                        }
                      }} 
                      className="aspect-[4/3]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailySalesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip 
                            content={props => (
                              <ChartTooltipContent 
                                {...props}
                                formatter={(value) => [`R$ ${value}`, 'Valor']}
                              />
                            )}
                          />
                          <Bar dataKey="vendas" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-sm font-bold text-gray-600">Total de Vendas</p>
                        <p className="text-2xl font-bold">R$ 21.670</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        <span className="font-bold">12.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-kid-blue flex items-center gap-2">
                      <LineChart className="h-5 w-5" /> 
                      Vendas Mensais
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-600">
                      Visualização das vendas nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ChartContainer 
                      config={{
                        vendas: {
                          label: "Vendas",
                          color: "#7E69AB"
                        }
                      }}
                      className="aspect-[4/3]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySalesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip 
                            content={props => (
                              <ChartTooltipContent 
                                {...props}
                                formatter={(value) => [`R$ ${value}`, 'Valor']}
                              />
                            )}
                          />
                          <Bar dataKey="vendas" fill="#7E69AB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-sm font-bold text-gray-600">Total de Vendas</p>
                        <p className="text-2xl font-bold">R$ 273.700</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        <span className="font-bold">8.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-kid-blue">
                      Itens Mais Vendidos
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-600">
                      Top 5 produtos mais populares
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer 
                      config={{
                        value: {
                          label: "Quantidade",
                          color: "#6E59A5"
                        }
                      }}
                      className="aspect-[4/3]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topSellingItemsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {topSellingItemsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} unidades`, 'Quantidade']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-kid-blue">
                      Detalhamento de Produtos
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-600">
                      Lista completa de vendas por produto
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">Produto</TableHead>
                          <TableHead className="font-bold text-right">Qtd. Vendida</TableHead>
                          <TableHead className="font-bold text-right">Valor Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Sanduíche de Queijo</TableCell>
                          <TableCell className="text-right">400</TableCell>
                          <TableCell className="text-right">R$ 2.200,00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Suco de Laranja</TableCell>
                          <TableCell className="text-right">300</TableCell>
                          <TableCell className="text-right">R$ 900,00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Maçã</TableCell>
                          <TableCell className="text-right">250</TableCell>
                          <TableCell className="text-right">R$ 500,00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Iogurte de Morango</TableCell>
                          <TableCell className="text-right">200</TableCell>
                          <TableCell className="text-right">R$ 700,00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Água Mineral</TableCell>
                          <TableCell className="text-right">150</TableCell>
                          <TableCell className="text-right">R$ 300,00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-kid-blue flex items-center gap-2">
                    <Package className="h-5 w-5" /> 
                    Relatório de Estoque
                  </CardTitle>
                  <CardDescription className="font-bold text-gray-600">
                    Controle geral de produtos no estoque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Produto</TableHead>
                        <TableHead className="font-bold text-right">Quantidade</TableHead>
                        <TableHead className="font-bold text-center">Status</TableHead>
                        <TableHead className="font-bold text-right">Última Atualização</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Em Estoque' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{item.lastUpdate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balances">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-kid-blue flex items-center gap-2">
                      <Users className="h-5 w-5" /> 
                      Relatório de Saldo por Aluno
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-600">
                      Acompanhamento financeiro dos alunos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">Aluno</TableHead>
                          <TableHead className="font-bold">Turma</TableHead>
                          <TableHead className="font-bold">Responsável</TableHead>
                          <TableHead className="font-bold text-right">Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentBalances.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>{student.parent}</TableCell>
                            <TableCell className={`text-right font-bold ${
                              student.balance < 10 ? 'text-red-500' : 'text-green-600'
                            }`}>
                              R$ {student.balance.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="font-bold text-lg text-kid-blue">Total de Saldo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">R$ 121,50</div>
                      <p className="text-xs text-gray-500 mt-1 font-bold">Somatório de todos os saldos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="font-bold text-lg text-kid-blue">Saldo Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">R$ 24,30</div>
                      <p className="text-xs text-gray-500 mt-1 font-bold">Média por aluno</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="font-bold text-lg text-kid-blue">Alunos com Baixo Saldo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1</div>
                      <p className="text-xs text-gray-500 mt-1 font-bold">Saldo abaixo de R$ 10,00</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.main>
      </div>
    </AdminSidebar>
  );
};

export default ReportsPage;
