
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Plus, 
  Filter,
  UserCheck,
  UserX,
  Users,
  UserCog
} from 'lucide-react';

// Mock users data extended from the UserContext mock
const usersData = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao@escola.edu', 
    role: TipoUsuario.STUDENT, 
    class: '5º Ano A', 
    balance: 25.50,
    active: true,
    parent: 'Roberto Silva'
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    email: 'maria@escola.edu', 
    role: TipoUsuario.STUDENT, 
    class: '4º Ano B', 
    balance: 15.75,
    active: true,
    parent: 'Ana Oliveira'
  },
  { 
    id: '3', 
    name: 'Roberto Pai', 
    email: 'roberto@email.com', 
    role: TipoUsuario.PARENT, 
    balance: 150.00,
    active: true,
    children: ['João Silva']
  },
  { 
    id: '4', 
    name: 'Ana Oliveira', 
    email: 'ana@email.com', 
    role: TipoUsuario.PARENT, 
    balance: 200.00,
    active: true,
    children: ['Maria Oliveira']
  },
  { 
    id: '5', 
    name: 'Carlos Lima', 
    email: 'carlos@escola.edu', 
    role: TipoUsuario.STAFF, 
    balance: 0,
    active: true,
    department: 'Cantina'
  },
  { 
    id: '6', 
    name: 'Admin Cantina', 
    email: 'admin@escola.edu', 
    role: TipoUsuario.ADMIN, 
    balance: 0,
    active: true
  },
];

const UsersManagementPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Apenas admin pode acessar
    if (!user || user.role !== TipoUsuario.ADMIN) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Filter users based on search term and role
    let result = usersData;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.class && user.class.toLowerCase().includes(term))
      );
    }
    
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, selectedRole]);
  
  if (!user || user.role !== TipoUsuario.ADMIN) return null;

  const countByRole = (role: string) => {
    return usersData.filter(user => user.role === role).length;
  };
  
  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gray-50">
        <motion.main 
          className="container mx-auto py-6 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-kid-blue mb-6">Gerenciamento de Usuários</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="font-bold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-kid-blue" />
                  <span>Total de Usuários</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{usersData.length}</div>
                <p className="text-xs text-gray-500 mt-1 font-bold">Usuários registrados</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="font-bold text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span>Alunos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{countByRole(TipoUsuario.STUDENT)}</div>
                <p className="text-xs text-gray-500 mt-1 font-bold">Alunos ativos</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="font-bold text-lg flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-purple-600" />
                  <span>Responsáveis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{countByRole(TipoUsuario.PARENT)}</div>
                <p className="text-xs text-gray-500 mt-1 font-bold">Responsáveis cadastrados</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="font-bold text-lg flex items-center gap-2">
                  <UserX className="h-5 w-5 text-amber-600" />
                  <span>Funcionários</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{countByRole(TipoUsuario.STAFF) + countByRole(TipoUsuario.ADMIN)}</div>
                <p className="text-xs text-gray-500 mt-1 font-bold">Funcionários e admins</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-xl text-kid-blue">Listagem de Usuários</CardTitle>
              <CardDescription className="font-bold text-gray-600">
                Gerencie todos os usuários do sistema
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, email ou turma..."
                    className="pl-10 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2 font-bold">
                    <Filter className="h-4 w-4" /> Filtros
                  </Button>
                  <Button className="gap-2 bg-kid-blue font-bold">
                    <Plus className="h-4 w-4" /> Novo Usuário
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <Button 
                  variant={selectedRole === null ? "default" : "outline"}
                  className="whitespace-nowrap font-bold"
                  onClick={() => setSelectedRole(null)}
                >
                  Todos
                </Button>
                <Button 
                  variant={selectedRole === TipoUsuario.STUDENT ? "default" : "outline"}
                  className="whitespace-nowrap font-bold"
                  onClick={() => setSelectedRole(TipoUsuario.STUDENT)}
                >
                  Alunos
                </Button>
                <Button 
                  variant={selectedRole === TipoUsuario.PARENT ? "default" : "outline"}
                  className="whitespace-nowrap font-bold"
                  onClick={() => setSelectedRole(TipoUsuario.PARENT)}
                >
                  Responsáveis
                </Button>
                <Button 
                  variant={selectedRole === TipoUsuario.STAFF ? "default" : "outline"}
                  className="whitespace-nowrap font-bold"
                  onClick={() => setSelectedRole(TipoUsuario.STAFF)}
                >
                  Funcionários
                </Button>
                <Button 
                  variant={selectedRole === TipoUsuario.ADMIN ? "default" : "outline"}
                  className="whitespace-nowrap font-bold"
                  onClick={() => setSelectedRole(TipoUsuario.ADMIN)}
                >
                  Administradores
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Nome</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Tipo</TableHead>
                    <TableHead className="font-bold">Detalhes</TableHead>
                    <TableHead className="font-bold text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === TipoUsuario.ADMIN ? 'bg-purple-100 text-purple-800' : 
                            user.role === TipoUsuario.STAFF ? 'bg-blue-100 text-blue-800' :
                            user.role === TipoUsuario.PARENT ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.role === TipoUsuario.STUDENT ? user.class : 
                           user.role === TipoUsuario.PARENT ? `Responsável por: ${(user as any).children?.join(', ')}` : 
                           user.role === TipoUsuario.STAFF ? (user as any).department : ''}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {user.balance !== undefined && user.balance > 0 ? 
                            `R$ ${user.balance.toFixed(2)}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <p className="text-gray-500 font-bold">Nenhum usuário encontrado.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.main>
      </div>
    </AdminSidebar>
  );
};

export default UsersManagementPage;
