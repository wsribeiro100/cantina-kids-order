
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema
const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.string(),
  class: z.string().optional(),
  profileImage: z.string().url('URL inválida').optional().or(z.literal('')),
})
.refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type UserFormValues = z.infer<typeof userSchema>;

const UserRegistration: React.FC = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(true);
  
  // Initialize form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
      class: '',
      profileImage: '',
    },
  });
  
  const selectedRole = form.watch('role');
  
  const onSubmit = (data: UserFormValues) => {
    // Here you would handle form submission, e.g., API call to register the user
    console.log('Form submitted:', data);
    
    toast({
      title: 'Usuário cadastrado',
      description: `${data.name} foi cadastrado com sucesso como ${data.role}`,
    });
    
    // Reset the form after successful submission
    form.reset();
  };
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kid-blue">Cadastro de Usuário</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para cadastrar um novo usuário no sistema
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* User Type */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Usuário</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="STUDENT">{TipoUsuario.STUDENT}</SelectItem>
                    <SelectItem value="PARENT">{TipoUsuario.PARENT}</SelectItem>
                    <SelectItem value="STAFF">{TipoUsuario.STAFF}</SelectItem>
                    {isAdmin && (
                      <SelectItem value="ADMIN">{TipoUsuario.ADMIN}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Class (only for students) */}
          {selectedRole === 'STUDENT' && (
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3º Ano A">3º Ano A</SelectItem>
                      <SelectItem value="3º Ano B">3º Ano B</SelectItem>
                      <SelectItem value="3º Ano C">3º Ano C</SelectItem>
                      <SelectItem value="4º Ano A">4º Ano A</SelectItem>
                      <SelectItem value="4º Ano B">4º Ano B</SelectItem>
                      <SelectItem value="4º Ano C">4º Ano C</SelectItem>
                      <SelectItem value="5º Ano A">5º Ano A</SelectItem>
                      <SelectItem value="5º Ano B">5º Ano B</SelectItem>
                      <SelectItem value="5º Ano C">5º Ano C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Profile Image */}
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto de Perfil (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <Button type="submit" className="w-full kid-button-primary">
            Cadastrar Usuário
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UserRegistration;
