
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search, FileText, UserPlus, Package, ShoppingCart, 
  DollarSign, AlertCircle, Filter, ArrowDownWideNarrow, 
  ArrowUpWideNarrow, Download, Printer, Eye 
} from 'lucide-react';
import { TipoUsuario } from '@/model/User/Enuns/TipoUsuario';

// Log types
type LogType = 'user' | 'product' | 'order' | 'payment' | 'system';

// Log severity
type LogSeverity = 'info' | 'warning' | 'error';

// Log entry model
interface LogEntry {
  id: number;
  type: LogType;
  severity: LogSeverity;
  action: string;
  description: string;
  userId: string;
  userName: string;
  userRole: TipoUsuario;
  timestamp: Date;
  details?: Record<string, any>;
}

// Mock log entries for demonstration
const mockLogs: LogEntry[] = [
  {
    id: 1,
    type: 'user',
    severity: 'info',
    action: 'USER_CREATED',
    description: 'Novo usuário criado no sistema',
    userId: 'admin123',
    userName: 'Admin Cantina',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-12T09:32:15'),
    details: {
      newUser: {
        id: 'user456',
        name: 'Maria Silva',
        email: 'maria@escola.edu',
        role: TipoUsuario.PARENT,
      }
    }
  },
  {
    id: 2,
    type: 'product',
    severity: 'info',
    action: 'PRODUCT_ADDED',
    description: 'Novo produto adicionado ao catálogo',
    userId: 'admin123',
    userName: 'Admin Cantina',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-12T10:15:42'),
    details: {
      product: {
        id: 13,
        name: 'Salada de Frutas',
        price: 4.50,
        category: 'sobremesas',
      }
    }
  },
  {
    id: 3,
    type: 'order',
    severity: 'info',
    action: 'ORDER_PLACED',
    description: 'Pedido realizado',
    userId: 'student789',
    userName: 'João Alves',
    userRole: TipoUsuario.STUDENT,
    timestamp: new Date('2025-04-12T11:05:03'),
    details: {
      order: {
        id: 'ord123',
        total: 7.50,
        items: [
          { name: 'Sanduíche', price: 5.50, quantity: 1 },
          { name: 'Água', price: 2.00, quantity: 1 },
        ]
      }
    }
  },
  {
    id: 4,
    type: 'payment',
    severity: 'info',
    action: 'WALLET_RECHARGED',
    description: 'Carteira digital recarregada',
    userId: 'parent456',
    userName: 'Carlos Santos',
    userRole: TipoUsuario.PARENT,
    timestamp: new Date('2025-04-12T14:23:18'),
    details: {
      transaction: {
        id: 'tx789',
        amount: 50.00,
        method: 'credit_card',
        studentName: 'Ana Santos'
      }
    }
  },
  {
    id: 5,
    type: 'order',
    severity: 'warning',
    action: 'ORDER_CANCELLED',
    description: 'Pedido cancelado pelo cliente',
    userId: 'student789',
    userName: 'João Alves',
    userRole: TipoUsuario.STUDENT,
    timestamp: new Date('2025-04-12T11:52:37'),
    details: {
      order: {
        id: 'ord123',
        reason: 'Cliente desistiu',
        refundStatus: 'processed'
      }
    }
  },
  {
    id: 6,
    type: 'system',
    severity: 'error',
    action: 'PAYMENT_FAILED',
    description: 'Falha no processamento de pagamento',
    userId: 'parent789',
    userName: 'Ana Costa',
    userRole: TipoUsuario.PARENT,
    timestamp: new Date('2025-04-12T15:18:42'),
    details: {
      error: {
        code: 'PAYMENT_DECLINED',
        message: 'Cartão recusado pela operadora',
        transactionId: 'tx456'
      }
    }
  },
  {
    id: 7,
    type: 'product',
    severity: 'warning',
    action: 'PRODUCT_OUT_OF_STOCK',
    description: 'Produto esgotado no estoque',
    userId: 'system',
    userName: 'Sistema',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-12T10:30:12'),
    details: {
      product: {
        id: 5,
        name: 'Nuggets de Frango',
        previousStock: 2,
        currentStock: 0
      }
    }
  },
  {
    id: 8,
    type: 'user',
    severity: 'info',
    action: 'USER_LOGIN',
    description: 'Usuário realizou login',
    userId: 'admin123',
    userName: 'Admin Cantina',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-13T08:45:23'),
    details: {
      browser: 'Chrome 123.0.0.1',
      ip: '192.168.1.100',
      device: 'Desktop'
    }
  },
  {
    id: 9,
    type: 'system',
    severity: 'info',
    action: 'DAILY_REPORT_GENERATED',
    description: 'Relatório diário de vendas gerado',
    userId: 'system',
    userName: 'Sistema',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-13T00:01:05'),
    details: {
      report: {
        date: '2025-04-12',
        totalSales: 527.50,
        orderCount: 42
      }
    }
  },
  {
    id: 10,
    type: 'system',
    severity: 'warning',
    action: 'DATABASE_BACKUP',
    description: 'Backup automático do banco de dados',
    userId: 'system',
    userName: 'Sistema',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-13T03:00:00'),
    details: {
      backup: {
        size: '125MB',
        location: 'gs://cantina-backup/20250413.gz',
        duration: '45s'
      }
    }
  },
  {
    id: 11,
    type: 'user',
    severity: 'warning',
    action: 'LOGIN_FAILED',
    description: 'Tentativa de login falhou',
    userId: 'unknown',
    userName: 'Sistema',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-13T05:42:18'),
    details: {
      attemptedUsername: 'admin',
      reason: 'Senha incorreta',
      ip: '203.0.113.42'
    }
  },
  {
    id: 12,
    type: 'user',
    severity: 'error',
    action: 'ACCOUNT_LOCKED',
    description: 'Conta bloqueada após múltiplas tentativas de login',
    userId: 'system',
    userName: 'Sistema',
    userRole: TipoUsuario.ADMIN,
    timestamp: new Date('2025-04-13T05:45:36'),
    details: {
      username: 'admin',
      failedAttempts: 5,
      lockDuration: '30 minutos'
    }
  },
];

// Helper function to format log details as JSON
const formatLogDetails = (details: Record<string, any>): string => {
  return JSON.stringify(details, null, 2);
};

const AuditLogsScreen: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Apply filters and search to logs
  const applyFilters = () => {
    let results = [...logs];
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(log => log.type === filterType);
    }
    
    // Apply severity filter
    if (filterSeverity !== 'all') {
      results = results.filter(log => log.severity === filterSeverity);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(log => 
        log.action.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        log.userName.toLowerCase().includes(query) ||
        formatLogDetails(log.details || {}).toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.timestamp.getTime() - b.timestamp.getTime();
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });
    
    setFilteredLogs(results);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterSeverity('all');
    setSortOrder('desc');
    setFilteredLogs(logs);
  };
  
  // Apply filters whenever filter states change
  React.useEffect(() => {
    applyFilters();
  }, [searchQuery, filterType, filterSeverity, sortOrder]);
  
  // Get icon based on log type
  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'system':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get color based on severity
  const getSeverityColor = (severity: LogSeverity): string => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs de Auditoria</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar logs..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="product">Produto</SelectItem>
              <SelectItem value="order">Pedido</SelectItem>
              <SelectItem value="payment">Pagamento</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="info">Informativo</SelectItem>
              <SelectItem value="warning">Alerta</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="md:w-10"
            title={sortOrder === 'asc' ? 'Mais antigos primeiro' : 'Mais recentes primeiro'}
          >
            {sortOrder === 'asc' 
              ? <ArrowUpWideNarrow className="h-4 w-4" /> 
              : <ArrowDownWideNarrow className="h-4 w-4" />
            }
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={resetFilters}
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
        
        {filteredLogs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className="capitalize">{log.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getSeverityColor(log.severity)}`}>
                      {log.severity === 'info' && 'Informativo'}
                      {log.severity === 'warning' && 'Alerta'}
                      {log.severity === 'error' && 'Erro'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={log.description}>
                    {log.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${log.id}`} className="border-none">
                        <AccordionTrigger className="py-0 justify-end">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Detalhes
                          </Button>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre className="whitespace-pre-wrap">
                              {formatLogDetails(log.details || {})}
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nenhum log encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsScreen;
