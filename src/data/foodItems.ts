
import { FoodItem } from '@/contexts/CartContext';

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Sanduíche de Queijo',
    description: 'Pão fresco com queijo derretido',
    price: 5.50,
    image: '/placeholder.svg',
    category: 'sanduiches'
  },
  {
    id: 2,
    name: 'Suco de Laranja',
    description: 'Suco natural de laranja',
    price: 3.00,
    image: '/placeholder.svg',
    category: 'bebidas'
  },
  {
    id: 3,
    name: 'Maçã',
    description: 'Maçã fresca e crocante',
    price: 2.00,
    image: '/placeholder.svg',
    category: 'frutas'
  },
  {
    id: 4,
    name: 'Barra de Cereal',
    description: 'Barra de cereal com chocolate',
    price: 2.50,
    image: '/placeholder.svg',
    category: 'lanches'
  },
  {
    id: 5,
    name: 'Nuggets de Frango',
    description: 'Porção com 6 nuggets assados',
    price: 6.00,
    image: '/placeholder.svg',
    category: 'pratos'
  },
  {
    id: 6,
    name: 'Iogurte de Morango',
    description: 'Iogurte natural com pedaços de morango',
    price: 3.50,
    image: '/placeholder.svg',
    category: 'sobremesas'
  },
  {
    id: 7,
    name: 'Água Mineral',
    description: 'Garrafa de água mineral sem gás',
    price: 2.00,
    image: '/placeholder.svg',
    category: 'bebidas'
  },
  {
    id: 8,
    name: 'Espaguete com Almôndegas',
    description: 'Espaguete ao molho de tomate com almôndegas',
    price: 8.00,
    image: '/placeholder.svg',
    category: 'pratos'
  },
  {
    id: 9,
    name: 'Salada de Frutas',
    description: 'Mix de frutas frescas picadas',
    price: 4.50,
    image: '/placeholder.svg',
    category: 'sobremesas'
  },
  {
    id: 10,
    name: 'Pizza de Queijo',
    description: 'Fatia de pizza de queijo',
    price: 5.00,
    image: '/placeholder.svg',
    category: 'pratos'
  },
  {
    id: 11,
    name: 'Suco de Uva',
    description: 'Suco natural de uva',
    price: 3.00,
    image: '/placeholder.svg',
    category: 'bebidas'
  },
  {
    id: 12,
    name: 'Banana',
    description: 'Banana fresca',
    price: 1.50,
    image: '/placeholder.svg',
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
