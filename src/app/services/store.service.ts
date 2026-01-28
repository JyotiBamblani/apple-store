import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Invoice } from '../models/invoice.model';
import { Product } from '../models/product.model';
import { USERS } from '../data/users.data';
import { INVOICES } from '../data/invoices.data';
import {
  validateUser,
  validateInvoice,
  validateProduct,
  validateUsersArray,
  validateInvoicesArray,
  validateEmail
} from '../utils/validation';
import {
  StoreResult,
  StoreError,
  StoreErrorCode,
  createSuccess,
  createError
} from '../models/store-result.model';

/** Local storage keys for persisted data */
const USERS_KEY = 'apple-store-users';
const INVOICES_KEY = 'apple-store-invoices';

/** Detect whether we are running in a browser (localStorage is available). */
const IS_BROWSER: boolean =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Central state and persistence for users and invoices.
 * All user and purchase data is stored in localStorage and exposed via signals.
 * Includes comprehensive error handling and validation.
 */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private usersSignal = signal<User[]>(this.loadUsers());
  private invoicesSignal = signal<Invoice[]>(this.loadInvoices());

  /** Read-only signals for reactive UI updates */
  users = this.usersSignal.asReadonly();
  invoices = this.invoicesSignal.asReadonly();

  /** Error signal for store operations */
  private errorSignal = signal<string | null>(null);
  error = this.errorSignal.asReadonly();

  /**
   * Load users from localStorage; seed with default data if empty.
   * Includes validation and error handling.
   */
  private loadUsers(): User[] {
    // On the server (SSR) localStorage is not available; fall back to seed data.
    if (!IS_BROWSER) {
      return [...USERS];
    }

    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        
        // Validate parsed data
        const validation = validateUsersArray(parsed);
        if (!validation.valid) {
          console.warn('Invalid users data in localStorage:', validation.error);
          this.errorSignal.set(`Failed to load users: ${validation.error}`);
          return [...USERS];
        }

        return parsed as User[];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading users from localStorage:', errorMessage);
      this.errorSignal.set(`Failed to load users: ${errorMessage}`);
    }
    return [...USERS];
  }

  /**
   * Load invoices from localStorage; seed with default data if empty.
   * Includes validation and error handling.
   */
  private loadInvoices(): Invoice[] {
    // On the server (SSR) localStorage is not available; fall back to seed data.
    if (!IS_BROWSER) {
      return [...INVOICES];
    }

    try {
      const raw = localStorage.getItem(INVOICES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        
        // Validate parsed data
        const validation = validateInvoicesArray(parsed);
        if (!validation.valid) {
          console.warn('Invalid invoices data in localStorage:', validation.error);
          this.errorSignal.set(`Failed to load invoices: ${validation.error}`);
          return [...INVOICES];
        }

        return parsed as Invoice[];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading invoices from localStorage:', errorMessage);
      this.errorSignal.set(`Failed to load invoices: ${errorMessage}`);
    }
    return [...INVOICES];
  }

  /**
   * Write users to localStorage with error handling.
   * @param list - Users array to persist
   * @returns StoreResult indicating success or failure
   */
  private persistUsers(list: User[]): StoreResult<void> {
    // When not in a browser (e.g. during SSR), skip persistence but keep in-memory state.
    if (!IS_BROWSER) {
      // We still validate to keep the same guarantees.
      const validation = validateUsersArray(list);
      if (!validation.valid) {
        const error = createError(
          validation.error || 'Invalid users data',
          StoreErrorCode.VALIDATION_ERROR
        );
        this.errorSignal.set(error.error);
        return error;
      }

      this.errorSignal.set(null);
      return createSuccess(undefined);
    }

    try {
      // Validate before persisting
      const validation = validateUsersArray(list);
      if (!validation.valid) {
        const error = createError(validation.error || 'Invalid users data', StoreErrorCode.VALIDATION_ERROR);
        this.errorSignal.set(error.error);
        return error;
      }

      localStorage.setItem(USERS_KEY, JSON.stringify(list));
      this.errorSignal.set(null);
      return createSuccess(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const storeError = createError(`Failed to save users: ${errorMessage}`, StoreErrorCode.STORAGE_ERROR);
      console.error('Error persisting users:', errorMessage);
      this.errorSignal.set(storeError.error);
      return storeError;
    }
  }

  /**
   * Write invoices to localStorage with error handling.
   * @param list - Invoices array to persist
   * @returns StoreResult indicating success or failure
   */
  private persistInvoices(list: Invoice[]): StoreResult<void> {
    // When not in a browser (e.g. during SSR), skip persistence but keep in-memory state.
    if (!IS_BROWSER) {
      const validation = validateInvoicesArray(list);
      if (!validation.valid) {
        const error = createError(
          validation.error || 'Invalid invoices data',
          StoreErrorCode.VALIDATION_ERROR
        );
        this.errorSignal.set(error.error);
        return error;
      }

      this.errorSignal.set(null);
      return createSuccess(undefined);
    }

    try {
      // Validate before persisting
      const validation = validateInvoicesArray(list);
      if (!validation.valid) {
        const error = createError(validation.error || 'Invalid invoices data', StoreErrorCode.VALIDATION_ERROR);
        this.errorSignal.set(error.error);
        return error;
      }

      localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
      this.errorSignal.set(null);
      return createSuccess(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const storeError = createError(`Failed to save invoices: ${errorMessage}`, StoreErrorCode.STORAGE_ERROR);
      console.error('Error persisting invoices:', errorMessage);
      this.errorSignal.set(storeError.error);
      return storeError;
    }
  }

  /**
   * Set users array with validation and error handling.
   * @param users - Users array to set
   * @returns StoreResult indicating success or failure
   */
  setUsers(users: User[]): StoreResult<void> {
    const validation = validateUsersArray(users);
    if (!validation.valid) {
      const error = createError(validation.error || 'Invalid users data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    this.usersSignal.set([...users]);
    return this.persistUsers(this.usersSignal());
  }

  /**
   * Update a user by id (name and/or itemsPurchased) with validation.
   * @param id - User ID to update
   * @param patch - Partial user data to update
   * @returns StoreResult indicating success or failure
   */
  updateUser(id: string, patch: Partial<Pick<User, 'name' | 'itemsPurchased'>>): StoreResult<User> {
    if (!id || typeof id !== 'string' || !id.trim()) {
      const error = createError('User ID is required', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    // Validate patch data
    if (patch.name !== undefined && (!patch.name || typeof patch.name !== 'string' || !patch.name.trim())) {
      const error = createError('User name must be a non-empty string', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    if (patch.itemsPurchased !== undefined && (typeof patch.itemsPurchased !== 'number' || patch.itemsPurchased < 0 || !Number.isInteger(patch.itemsPurchased))) {
      const error = createError('Items purchased must be a non-negative integer', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    const list = this.usersSignal();
    const userIndex = list.findIndex((u) => u.id === id);
    
    if (userIndex === -1) {
      const error = createError(`User with ID "${id}" not found`, StoreErrorCode.NOT_FOUND);
      this.errorSignal.set(error.error);
      return error;
    }

    const updatedUser: User = { ...list[userIndex], ...patch };
    
    // Validate updated user
    const validation = validateUser(updatedUser);
    if (!validation.valid) {
      const error = createError(validation.error || 'Invalid user data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    this.usersSignal.update((prev) => {
      const next = prev.map((u) => (u.id === id ? updatedUser : u));
      const persistResult = this.persistUsers(next);
      if (!persistResult.success) {
        // Revert on persistence failure
        return prev;
      }
      return next;
    });

    this.errorSignal.set(null);
    return createSuccess(updatedUser);
  }

  /**
   * Add a new invoice with validation and error handling.
   * @param invoice - Invoice data (without id)
   * @returns StoreResult with the created invoice or error
   */
  addInvoice(invoice: Omit<Invoice, 'id'>): StoreResult<Invoice> {
    // Validate invoice data
    const validation = validateInvoice(invoice);
    if (!validation.valid) {
      const error = createError(validation.error || 'Invalid invoice data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    const id = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newInvoice: Invoice = { ...invoice, id };

    // Validate complete invoice
    const fullValidation = validateInvoice(newInvoice);
    if (!fullValidation.valid) {
      const error = createError(fullValidation.error || 'Invalid invoice data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    this.invoicesSignal.update((list) => {
      const next = [newInvoice, ...list];
      const persistResult = this.persistInvoices(next);
      if (!persistResult.success) {
        // Revert on persistence failure
        return list;
      }
      return next;
    });

    this.errorSignal.set(null);
    return createSuccess(newInvoice);
  }

  /**
   * Set invoices array with validation.
   * @param invoices - Invoices array to set
   * @returns StoreResult indicating success or failure
   */
  setInvoices(invoices: Invoice[]): StoreResult<void> {
    const validation = validateInvoicesArray(invoices);
    if (!validation.valid) {
      const error = createError(validation.error || 'Invalid invoices data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    this.invoicesSignal.set([...invoices]);
    return this.persistInvoices(this.invoicesSignal());
  }

  /**
   * Record a purchase: adds an invoice and updates existing user (by email)
   * or creates a new user. Includes comprehensive validation.
   * @param params - Purchase parameters
   * @returns StoreResult indicating success or failure
   */
  recordPurchase(params: {
    product: Product;
    customerName: string;
    customerEmail: string;
  }): StoreResult<{ invoice: Invoice; user: User }> {
    // Validate product
    const productValidation = validateProduct(params.product);
    if (!productValidation.valid) {
      const error = createError(productValidation.error || 'Invalid product data', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    // Validate customer name
    const customerName = params.customerName?.trim() || '';
    if (!customerName) {
      const error = createError('Customer name is required', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    // Validate customer email
    const customerEmail = params.customerEmail?.trim() || '';
    if (!customerEmail) {
      const error = createError('Customer email is required', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    if (!validateEmail(customerEmail)) {
      const error = createError('Customer email must be a valid email address', StoreErrorCode.VALIDATION_ERROR);
      this.errorSignal.set(error.error);
      return error;
    }

    // Create invoice
    const now = new Date().toISOString();
    const invoiceResult = this.addInvoice({
      productId: params.product.id,
      productName: params.product.name,
      userEmail: customerEmail,
      date: now,
      status: 'Paid'
    });

    if (!invoiceResult.success) {
      return invoiceResult;
    }

    // Update or create user
    const list = this.usersSignal();
    const existing = list.find((u) => u.email.toLowerCase() === customerEmail.toLowerCase());
    
    let userResult: StoreResult<User>;

    if (existing) {
      // Update existing user
      userResult = this.updateUser(existing.id, {
        name: customerName,
        itemsPurchased: existing.itemsPurchased + 1
      });
    } else {
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: customerName,
        email: customerEmail,
        itemsPurchased: 1
      };

      // Validate new user
      const userValidation = validateUser(newUser);
      if (!userValidation.valid) {
        const error = createError(userValidation.error || 'Invalid user data', StoreErrorCode.VALIDATION_ERROR);
        this.errorSignal.set(error.error);
        // Rollback invoice if user creation fails
        this.invoicesSignal.update((invList) => invList.filter((inv) => inv.id !== invoiceResult.data.id));
        this.persistInvoices(this.invoicesSignal());
        return error;
      }

      // Check for duplicate email
      const duplicateCheck = list.find((u) => u.email.toLowerCase() === customerEmail.toLowerCase());
      if (duplicateCheck) {
        const error = createError('User with this email already exists', StoreErrorCode.DUPLICATE_EMAIL);
        this.errorSignal.set(error.error);
        // Rollback invoice
        this.invoicesSignal.update((invList) => invList.filter((inv) => inv.id !== invoiceResult.data.id));
        this.persistInvoices(this.invoicesSignal());
        return error;
      }

      this.usersSignal.update((prev) => {
        const next = [...prev, newUser];
        const persistResult = this.persistUsers(next);
        if (!persistResult.success) {
          return prev;
        }
        return next;
      });

      userResult = createSuccess(newUser);
    }

    if (!userResult.success) {
      // Rollback invoice if user update/create fails
      this.invoicesSignal.update((invList) => invList.filter((inv) => inv.id !== invoiceResult.data.id));
      this.persistInvoices(this.invoicesSignal());
      return userResult;
    }

    this.errorSignal.set(null);
    return createSuccess({
      invoice: invoiceResult.data,
      user: userResult.data
    });
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
