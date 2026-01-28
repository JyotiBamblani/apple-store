import { Invoice } from '../models/invoice.model';

// Invoices with varied dates (newest first when sorted desc)
export const INVOICES: Invoice[] = [
  { id: 'INV-2025-012', productId: '1', productName: 'iPhone 16 Pro', userEmail: 'alice@example.com', date: '2025-01-28T10:30:00Z', status: 'Shipped' },
  { id: 'INV-2025-011', productId: '2', productName: 'MacBook Pro 14"', userEmail: 'bob.smith@example.com', date: '2025-01-27T14:00:00Z', status: 'Paid' },
  { id: 'INV-2025-010', productId: '1', productName: 'iPhone 16 Pro', userEmail: 'carol.w@example.com', date: '2025-01-26T09:15:00Z', status: 'Paid' },
  { id: 'INV-2025-009', productId: '5', productName: 'AirPods Pro', userEmail: 'david.brown@example.com', date: '2025-01-25T16:45:00Z', status: 'Shipped' },
  { id: 'INV-2025-008', productId: '3', productName: 'iPad Pro', userEmail: 'eve.davis@example.com', date: '2025-01-24T11:20:00Z', status: 'Pending' },
  { id: 'INV-2025-007', productId: '1', productName: 'iPhone 16 Pro', userEmail: 'frank.m@example.com', date: '2025-01-23T08:00:00Z', status: 'Paid' },
  { id: 'INV-2025-006', productId: '4', productName: 'Apple Watch Ultra 2', userEmail: 'grace.lee@example.com', date: '2025-01-22T13:30:00Z', status: 'Shipped' },
  { id: 'INV-2025-005', productId: '2', productName: 'MacBook Pro 14"', userEmail: 'henry.wilson@example.com', date: '2025-01-21T10:00:00Z', status: 'Paid' },
  { id: 'INV-2025-004', productId: '5', productName: 'AirPods Pro', userEmail: 'ivy.t@example.com', date: '2025-01-20T15:22:00Z', status: 'Refunded' },
  { id: 'INV-2025-003', productId: '3', productName: 'iPad Pro', userEmail: 'jack.a@example.com', date: '2025-01-19T09:45:00Z', status: 'Paid' },
  { id: 'INV-2025-002', productId: '1', productName: 'iPhone 16 Pro', userEmail: 'alice@example.com', date: '2025-01-18T12:10:00Z', status: 'Shipped' },
  { id: 'INV-2025-001', productId: '4', productName: 'Apple Watch Ultra 2', userEmail: 'bob.smith@example.com', date: '2025-01-17T14:55:00Z', status: 'Paid' },
];
