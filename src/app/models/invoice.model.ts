/** Invoice model (billing + localStorage); date is ISO string for sorting */
export interface Invoice {
  id: string;
  productName: string;
  productId: string;
  userEmail: string;
  date: string; // ISO date string for sorting
  status: 'Paid' | 'Pending' | 'Shipped' | 'Refunded';
}
