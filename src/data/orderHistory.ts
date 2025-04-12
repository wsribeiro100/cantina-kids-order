
import { FoodItem } from '@/contexts/CartContext';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface OrderItem {
  item: FoodItem;
  quantity: number;
}

export const orderHistory: Order[] = [
  {
    id: 'order-001',
    userId: '1',
    userName: 'João Silva',
    items: [
      {
        item: {
          id: 1,
          name: 'Sanduíche de Queijo',
          description: 'Pão fresco com queijo derretido',
          price: 5.50,
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
          category: 'sanduiches'
        },
        quantity: 2
      },
      {
        item: {
          id: 2,
          name: 'Suco de Laranja',
          description: 'Suco natural de laranja',
          price: 3.00,
          image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'bebidas'
        },
        quantity: 1
      }
    ],
    total: 14.00,
    status: 'completed',
    date: '2025-04-10T10:30:00'
  },
  {
    id: 'order-002',
    userId: '2',
    userName: 'Maria Oliveira',
    items: [
      {
        item: {
          id: 5,
          name: 'Nuggets de Frango',
          description: 'Porção com 6 nuggets assados',
          price: 6.00,
          image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
          category: 'pratos'
        },
        quantity: 1
      },
      {
        item: {
          id: 11,
          name: 'Suco de Uva',
          description: 'Suco natural de uva',
          price: 3.00,
          image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'bebidas'
        },
        quantity: 1
      }
    ],
    total: 9.00,
    status: 'completed',
    date: '2025-04-10T11:15:00'
  },
  {
    id: 'order-003',
    userId: '1',
    userName: 'João Silva',
    items: [
      {
        item: {
          id: 8,
          name: 'Espaguete com Almôndegas',
          description: 'Espaguete ao molho de tomate com almôndegas',
          price: 8.00,
          image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
          category: 'pratos'
        },
        quantity: 1
      }
    ],
    total: 8.00,
    status: 'pending',
    date: '2025-04-12T12:45:00'
  },
  {
    id: 'order-004',
    userId: '2',
    userName: 'Maria Oliveira',
    items: [
      {
        item: {
          id: 10,
          name: 'Pizza de Queijo',
          description: 'Fatia de pizza de queijo',
          price: 5.00,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'pratos'
        },
        quantity: 2
      },
      {
        item: {
          id: 7,
          name: 'Água Mineral',
          description: 'Garrafa de água mineral sem gás',
          price: 2.00,
          image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80',
          category: 'bebidas'
        },
        quantity: 2
      }
    ],
    total: 14.00,
    status: 'completed',
    date: '2025-04-11T13:20:00'
  },
  {
    id: 'order-005',
    userId: '1',
    userName: 'João Silva',
    items: [
      {
        item: {
          id: 6,
          name: 'Iogurte de Morango',
          description: 'Iogurte natural com pedaços de morango',
          price: 3.50,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'sobremesas'
        },
        quantity: 1
      },
      {
        item: {
          id: 3,
          name: 'Maçã',
          description: 'Maçã fresca e crocante',
          price: 2.00,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1367&q=80',
          category: 'frutas'
        },
        quantity: 2
      }
    ],
    total: 7.50,
    status: 'cancelled',
    date: '2025-04-09T15:05:00'
  }
];
