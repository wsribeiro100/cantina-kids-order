
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Megaphone, AlertCircle, Trash2, Send, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Notification types
type NotificationType = 'info' | 'promo' | 'alert';

// Notification target
type NotificationTarget = 'all' | 'students' | 'parents' | 'staff';

// Notification model
interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
  sent: boolean;
  createdAt: Date;
  sentAt?: Date;
}

// Sample notification data
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Cardápio Atualizado',
    message: 'O cardápio da cantina foi atualizado para o mês de Abril. Confira as novidades!',
    type: 'info',
    target: 'all',
    sent: true,
    createdAt: new Date('2025-04-01T09:00:00'),
    sentAt: new Date('2025-04-01T09:30:00'),
  },
  {
    id: 2,
    title: 'Promoção de Sucos',
    message: 'Compre 2 sucos naturais e ganhe 1 barra de cereal! Promoção válida até sexta-feira.',
    type: 'promo',
    target: 'all',
    sent: true,
    createdAt: new Date('2025-04-05T10:15:00'),
    sentAt: new Date('2025-04-05T11:00:00'),
  },
  {
    id: 3,
    title: 'Atualização do Sistema',
    message: 'O sistema estará indisponível neste domingo (14/04) das 22h às 23h para manutenção programada.',
    type: 'alert',
    target: 'all',
    sent: false,
    createdAt: new Date('2025-04-12T14:30:00'),
  },
];

const NotificationManagementScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id' | 'createdAt' | 'sent' | 'sentAt'>>({
    title: '',
    message: '',
    type: 'info',
    target: 'all'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('draft');
  
  const { toast } = useToast();
  
  const handleCreateNotification = () => {
    const notification: Notification = {
      id: Math.max(0, ...notifications.map(n => n.id)) + 1,
      ...newNotification,
      sent: false,
      createdAt: new Date(),
    };
    
    setNotifications([notification, ...notifications]);
    setIsDialogOpen(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      target: 'all'
    });
    
    toast({
      title: 'Notificação criada',
      description: 'A notificação foi salva como rascunho.',
    });
  };
  
  const handleSendNotification = (id: number) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, sent: true, sentAt: new Date() } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    
    toast({
      title: 'Notificação enviada',
      description: 'A notificação foi enviada com sucesso para os destinatários.',
    });
  };
  
  const handleDeleteNotification = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta notificação?')) {
      setNotifications(notifications.filter(n => n.id !== id));
      
      toast({
        title: 'Notificação excluída',
        description: 'A notificação foi removida permanentemente.',
      });
    }
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'draft') return !notification.sent;
    if (activeTab === 'sent') return notification.sent;
    return true; // 'all' tab
  });
  
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'promo':
        return <Megaphone className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getTypeName = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return 'Informativo';
      case 'promo':
        return 'Promoção';
      case 'alert':
        return 'Alerta';
      default:
        return 'Desconhecido';
    }
  };
  
  const getTargetName = (target: NotificationTarget) => {
    switch (target) {
      case 'all':
        return 'Todos';
      case 'students':
        return 'Estudantes';
      case 'parents':
        return 'Responsáveis';
      case 'staff':
        return 'Funcionários';
      default:
        return 'Desconhecido';
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestão de Notificações</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="draft" className="flex items-center gap-2">
                <BellOff className="h-4 w-4" />
                Rascunhos
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Enviadas
              </TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Notificação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Notificação</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para criar uma nova notificação.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input 
                      id="title" 
                      placeholder="Título da notificação"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensagem
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Conteúdo da notificação"
                      rows={4}
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">
                        Tipo
                      </label>
                      <Select 
                        value={newNotification.type}
                        onValueChange={(value) => setNewNotification({
                          ...newNotification, 
                          type: value as NotificationType
                        })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Informativo</SelectItem>
                          <SelectItem value="promo">Promoção</SelectItem>
                          <SelectItem value="alert">Alerta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="target" className="text-sm font-medium">
                        Destinatários
                      </label>
                      <Select 
                        value={newNotification.target}
                        onValueChange={(value) => setNewNotification({
                          ...newNotification, 
                          target: value as NotificationTarget
                        })}
                      >
                        <SelectTrigger id="target">
                          <SelectValue placeholder="Selecione os destinatários" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="students">Estudantes</SelectItem>
                          <SelectItem value="parents">Responsáveis</SelectItem>
                          <SelectItem value="staff">Funcionários</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateNotification}
                    disabled={!newNotification.title || !newNotification.message}
                  >
                    Salvar Notificação
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="draft" className="mt-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            {getTypeName(notification.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{getTargetName(notification.target)}</TableCell>
                        <TableCell>
                          {format(notification.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleSendNotification(notification.id)}
                            >
                              <Send className="h-4 w-4" />
                              Enviar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhuma notificação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="sent" className="mt-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Enviada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            {getTypeName(notification.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{getTargetName(notification.target)}</TableCell>
                        <TableCell>
                          {notification.sentAt && format(notification.sentAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhuma notificação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                            notification.sent ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {notification.sent ? 'Enviada' : 'Rascunho'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            {getTypeName(notification.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{getTargetName(notification.target)}</TableCell>
                        <TableCell>
                          {notification.sent && notification.sentAt
                            ? format(notification.sentAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            : format(notification.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!notification.sent && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleSendNotification(notification.id)}
                              >
                                <Send className="h-4 w-4" />
                                Enviar
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhuma notificação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationManagementScreen;
