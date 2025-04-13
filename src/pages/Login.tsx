
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Erro de login',
        description: 'Por favor, preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const resp = await login(username, password);
      console.log(resp);
      if (resp.success) {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo à Cantina Kids!',
        });

        switch (resp.role) {
          case 'staff':
            navigate('/catalogo');
            break;
          case 'admin':
            navigate('/admin');
          case 'parent':
          case 'student':
            navigate('/catalog');
            break;
        }
      } else {
        toast({
          title: 'Erro de login',
          description: 'Nome de usuário ou senha incorretos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // For demo purposes - show available test users
  const testUsers = [
    { name: 'Joao', role: 'Estudante' },
    { name: 'Maria Oliveira', role: 'Estudante' },
    { name: 'Roberto Pai', role: 'Responsável' },
    { name: 'Func', role: 'Funcionário' },
    { name: 'Admin Cantina', role: 'Administrador' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kid-blue mb-2">Cantina Kids</h1>
          <p className="text-gray-600">Faça seu pedido na cantina da escola!</p>
        </div>
        
        <Card className="kid-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Nome de Usuário</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome"
                className="rounded-xl text-lg"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="rounded-xl text-lg"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full kid-button-primary text-xl py-4"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
        
        {/* Demo instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 bg-yellow-100 p-4 rounded-xl border border-yellow-300"
        >
          <h3 className="font-bold text-gray-700 mb-2">Usuários para teste:</h3>
          <div className="space-y-1 text-sm">
            {testUsers.map((user, index) => (
              <p key={index}>
                <span className="font-semibold">{user.name}</span> ({user.role}) - Senha: 123
              </p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
