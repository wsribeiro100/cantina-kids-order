
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

// Mock transactions for demo purposes
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    userId: '1',
    type: TransactionType.DEPOSIT,
    amount: 50.00,
    description: 'Recarga via PIX',
    date: '2025-04-10T09:15:00'
  },
  {
    id: 'tx-002',
    userId: '1',
    type: TransactionType.PURCHASE,
    amount: -14.00,
    description: 'Compra na cantina',
    date: '2025-04-10T10:30:00',
    orderId: 'order-001'
  },
  {
    id: 'tx-003',
    userId: '1',
    type: TransactionType.DEPOSIT,
    amount: 20.00,
    description: 'Recarga via cartão',
    date: '2025-04-11T14:45:00'
  },
  {
    id: 'tx-004',
    userId: '2',
    type: TransactionType.DEPOSIT,
    amount: 30.00,
    description: 'Recarga via PIX',
    date: '2025-04-09T11:20:00'
  },
  {
    id: 'tx-005',
    userId: '2',
    type: TransactionType.PURCHASE,
    amount: -9.00,
    description: 'Compra na cantina',
    date: '2025-04-10T11:15:00',
    orderId: 'order-002'
  },
  {
    id: 'tx-006',
    userId: '1',
    type: TransactionType.PURCHASE,
    amount: -8.00,
    description: 'Compra na cantina',
    date: '2025-04-12T12:45:00',
    orderId: 'order-003'
  },
  {
    id: 'tx-007',
    userId: '2',
    type: TransactionType.PURCHASE,
    amount: -14.00,
    description: 'Compra na cantina',
    date: '2025-04-11T13:20:00',
    orderId: 'order-004'
  },
  {
    id: 'tx-008',
    userId: '1',
    type: TransactionType.REFUND,
    amount: 7.50,
    description: 'Reembolso de pedido cancelado',
    date: '2025-04-09T15:30:00',
    orderId: 'order-005'
  }
];
