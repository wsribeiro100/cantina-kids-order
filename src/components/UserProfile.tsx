
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';

const DIETARY_OPTIONS = [
  'Vegetariano',
  'Vegano',
  'Sem glúten',
  'Sem lactose',
  'Baixo açúcar',
  'Baixo sódio',
  'Alergia a amendoim',
  'Alergia a frutos do mar',
];

const UserProfile: React.FC = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
    class: user?.class || '',
    dietaryPreferences: user?.dietaryPreferences || [],
  });
  
  const [editing, setEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDietaryChange = (selected: string) => {
    setFormData(prev => {
      const current = [...prev.dietaryPreferences];
      
      if (current.includes(selected)) {
        return { ...prev, dietaryPreferences: current.filter(item => item !== selected) };
      } else {
        return { ...prev, dietaryPreferences: [...current, selected] };
      }
    });
  };
  
  const handleSaveChanges = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
      class: formData.class,
      dietaryPreferences: formData.dietaryPreferences,
    });
    
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram atualizadas com sucesso',
    });
    
    setEditing(false);
  };
  
  const handlePasswordChange = () => {
    if (oldPassword !== '123') {
      toast({
        title: 'Erro',
        description: 'Senha atual incorreta',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As novas senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Senha alterada',
      description: 'Sua senha foi alterada com sucesso',
    });
    
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {typeof user.role === 'string' ? user.role : user.role.toString()}
              </span>
              {user.class && (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
                  {user.class}
                </span>
              )}
            </div>
          </div>
          <Button 
            onClick={() => setEditing(!editing)} 
            variant={editing ? "default" : "outline"}
          >
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        </div>
        
        {/* Profile Form */}
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileImage">URL da Foto</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                />
              </div>
              {(user.role === TipoUsuario.STUDENT || typeof user.role === 'string' && user.role === 'student') && (
                <div className="space-y-2">
                  <Label htmlFor="class">Turma</Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>
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
                </div>
              )}
            </div>
            
            {(user.role === TipoUsuario.STUDENT || typeof user.role === 'string' && user.role === 'student') && (
              <div className="space-y-2">
                <Label>Preferências Alimentares</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DIETARY_OPTIONS.map(option => (
                    <div key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`diet-${option}`}
                        checked={formData.dietaryPreferences.includes(option)}
                        onChange={() => handleDietaryChange(option)}
                        className="mr-2"
                      />
                      <Label htmlFor={`diet-${option}`} className="cursor-pointer text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium mb-3">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.class && (
                  <div>
                    <p className="text-sm text-muted-foreground">Turma</p>
                    <p className="font-medium">{user.class}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Usuário</p>
                  <p className="font-medium">{typeof user.role === 'string' ? user.role : user.role.toString()}</p>
                </div>
              </div>
            </div>
            
            {/* Dietary Preferences */}
            {user.dietaryPreferences && user.dietaryPreferences.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-2">Preferências Alimentares</h2>
                <div className="flex flex-wrap gap-2">
                  {user.dietaryPreferences.map(preference => (
                    <span key={preference} className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {preference}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Change Password */}
            <div>
              <h2 className="text-lg font-medium mb-3">Alterar Senha</h2>
              <div className="space-y-3 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Senha Atual</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!oldPassword || !newPassword || !confirmPassword}
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserProfile;
