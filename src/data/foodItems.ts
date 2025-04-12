
import { FoodItem } from '@/contexts/CartContext';

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Sanduíche de Queijo',
    description: 'Pão fresco com queijo derretido',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
    category: 'sanduiches'
  },
  {
    id: 2,
    name: 'Suco de Laranja',
    description: 'Suco natural de laranja',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'bebidas'
  },
  {
    id: 3,
    name: 'Maçã',
    description: 'Maçã fresca e crocante',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1367&q=80',
    category: 'frutas'
  },
  {
    id: 4,
    name: 'Barra de Cereal',
    description: 'Barra de cereal com chocolate',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1611625618313-68b87aaa0626?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'lanches'
  },
  {
    id: 5,
    name: 'Nuggets de Frango',
    description: 'Porção com 6 nuggets assados',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    category: 'pratos'
  },
  {
    id: 6,
    name: 'Iogurte de Morango',
    description: 'Iogurte natural com pedaços de morango',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'sobremesas'
  },
  {
    id: 7,
    name: 'Água Mineral',
    description: 'Garrafa de água mineral sem gás',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80',
    category: 'bebidas'
  },
  {
    id: 8,
    name: 'Espaguete com Almôndegas',
    description: 'Espaguete ao molho de tomate com almôndegas',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
    category: 'pratos'
  },
  {
    id: 9,
    name: 'Salada de Frutas',
    description: 'Mix de frutas frescas picadas',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'sobremesas'
  },
  {
    id: 10,
    name: 'Pizza de Queijo',
    description: 'Fatia de pizza de queijo',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'pratos'
  },
  {
    id: 11,
    name: 'Suco de Uva',
    description: 'Suco natural de uva',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299ead2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'bebidas'
  },
  {
    id: 12,
    name: 'Banana',
    description: 'Banana fresca',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1356&q=80',
    category: 'frutas'
  }
];

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'sanduiches', name: 'Sanduíches' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'frutas', name: 'Frutas' },
  { id: 'lanches', name: 'Lanches' },
  { id: 'pratos', name: 'Pratos Quentes' },
  { id: 'sobremesas', name: 'Sobremesas' }
];
