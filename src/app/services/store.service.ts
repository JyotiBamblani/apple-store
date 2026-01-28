import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Invoice } from '../models/invoice.model';
import { Product } from '../models/product.model';
import { USERS } from '../data/users.data';
import { INVOICES } from '../data/invoices.data';

/** Local storage keys for persisted data */
const USERS_KEY = 'apple-store-users';
const INVOICES_KEY = 'apple-store-invoices';

/**
 * Central state and persistence for users and invoices.
 * All user and purchase data is stored in localStorage and exposed via signals.
 */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private usersSignal = signal<User[]>(this.loadUsers());
  private invoicesSignal = signal<Invoice[]>(this.loadInvoices());

  /** Read-only signals for reactive UI updates */
  users = this.usersSignal.asReadonly();
  invoices = this.invoicesSignal.asReadonly();

  /** Load users from localStorage; seed with default data if empty */
  private loadUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User[];
        return Array.isArray(parsed) ? parsed : [...USERS];
      }
    } catch {
      // ignore
    }
    return [...USERS];
  }

  /** Load invoices from localStorage; seed with default data if empty */
  private loadInvoices(): Invoice[] {
    try {
      const raw = localStorage.getItem(INVOICES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Invoice[];
        return Array.isArray(parsed) ? parsed : [...INVOICES];
      }
    } catch {
      // ignore
    }
    return [...INVOICES];
  }

  /** Write users to localStorage */
  private persistUsers(list: User[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  /** Write invoices to localStorage */
  private persistInvoices(list: Invoice[]): void {
    try {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  setUsers(users: User[]): void {
    this.usersSignal.set([...users]);
    this.persistUsers(this.usersSignal());
  }

  /** Update a user by id (name and/or itemsPurchased); persists to localStorage */
  updateUser(id: string, patch: Partial<Pick<User, 'name' | 'itemsPurchased'>>): void {
    this.usersSignal.update((list) => {
      const next = list.map((u) =>
        u.id === id ? { ...u, ...patch } : u
      );
      this.persistUsers(next);
      return next;
    });
  }

  /** Add a new invoice with generated id; persists to localStorage */
  addInvoice(invoice: Omit<Invoice, 'id'>): Invoice {
    const id = `INV-${Date.now()}`;
    const newInvoice: Invoice = { ...invoice, id };
    this.invoicesSignal.update((list) => {
      const next = [newInvoice, ...list];
      this.persistInvoices(next);
      return next;
    });
    return newInvoice;
  }

  setInvoices(invoices: Invoice[]): void {
    this.invoicesSignal.set([...invoices]);
    this.persistInvoices(this.invoicesSignal());
  }

  /**
   * Record a purchase: adds an invoice and updates existing user (by email)
   * or creates a new user; persists both to localStorage.
   */
  recordPurchase(params: {
    product: Product;
    customerName: string;
    customerEmail: string;
  }): void {
    const now = new Date().toISOString();
    this.addInvoice({
      productId: params.product.id,
      productName: params.product.name,
      userEmail: params.customerEmail,
      date: now,
      status: 'Paid'
    });

    const list = this.usersSignal();
    const existing = list.find((u) => u.email.toLowerCase() === params.customerEmail.toLowerCase());
    if (existing) {
      this.updateUser(existing.id, {
        name: params.customerName || existing.name,
        itemsPurchased: existing.itemsPurchased + 1
      });
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: params.customerName || 'Customer',
        email: params.customerEmail,
        itemsPurchased: 1
      };
      this.usersSignal.update((prev) => {
        const next = [...prev, newUser];
        this.persistUsers(next);
        return next;
      });
    }
  }
}
