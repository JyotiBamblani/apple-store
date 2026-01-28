/**
 * Validation utilities for store data
 * Plain JavaScript validation functions (JS fundamentals requirement)
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!trimmed) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
}

/**
 * Validate user data
 * @param {any} user - User object to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 */
export function validateUser(user: any): { valid: boolean; error?: string } {
  if (!user || typeof user !== 'object') {
    return { valid: false, error: 'User must be an object' };
  }

  if (!user.id || typeof user.id !== 'string' || !user.id.trim()) {
    return { valid: false, error: 'User ID is required and must be a non-empty string' };
  }

  if (!user.name || typeof user.name !== 'string' || !user.name.trim()) {
    return { valid: false, error: 'User name is required and must be a non-empty string' };
  }

  if (!user.email || typeof user.email !== 'string' || !user.email.trim()) {
    return { valid: false, error: 'User email is required and must be a non-empty string' };
  }

  if (!validateEmail(user.email)) {
    return { valid: false, error: 'User email must be a valid email address' };
  }

  if (typeof user.itemsPurchased !== 'number' || user.itemsPurchased < 0 || !Number.isInteger(user.itemsPurchased)) {
    return { valid: false, error: 'Items purchased must be a non-negative integer' };
  }

  return { valid: true };
}

/**
 * Validate invoice data
 * @param {any} invoice - Invoice object to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 */
export function validateInvoice(invoice: any): { valid: boolean; error?: string } {
  if (!invoice || typeof invoice !== 'object') {
    return { valid: false, error: 'Invoice must be an object' };
  }

  if (invoice.id && (typeof invoice.id !== 'string' || !invoice.id.trim())) {
    return { valid: false, error: 'Invoice ID must be a non-empty string if provided' };
  }

  if (!invoice.productName || typeof invoice.productName !== 'string' || !invoice.productName.trim()) {
    return { valid: false, error: 'Product name is required and must be a non-empty string' };
  }

  if (!invoice.productId || typeof invoice.productId !== 'string' || !invoice.productId.trim()) {
    return { valid: false, error: 'Product ID is required and must be a non-empty string' };
  }

  if (!invoice.userEmail || typeof invoice.userEmail !== 'string' || !invoice.userEmail.trim()) {
    return { valid: false, error: 'User email is required and must be a non-empty string' };
  }

  if (!validateEmail(invoice.userEmail)) {
    return { valid: false, error: 'User email must be a valid email address' };
  }

  if (!invoice.date || typeof invoice.date !== 'string' || !invoice.date.trim()) {
    return { valid: false, error: 'Invoice date is required and must be a non-empty string' };
  }

  // Validate ISO date format
  const date = new Date(invoice.date);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invoice date must be a valid ISO date string' };
  }

  const validStatuses = ['Paid', 'Pending', 'Shipped', 'Refunded'];
  if (!invoice.status || !validStatuses.includes(invoice.status)) {
    return { valid: false, error: `Invoice status must be one of: ${validStatuses.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Validate product data
 * @param {any} product - Product object to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 */
export function validateProduct(product: any): { valid: boolean; error?: string } {
  if (!product || typeof product !== 'object') {
    return { valid: false, error: 'Product must be an object' };
  }

  if (!product.id || typeof product.id !== 'string' || !product.id.trim()) {
    return { valid: false, error: 'Product ID is required and must be a non-empty string' };
  }

  if (!product.name || typeof product.name !== 'string' || !product.name.trim()) {
    return { valid: false, error: 'Product name is required and must be a non-empty string' };
  }

  if (typeof product.price !== 'number' || product.price < 0 || isNaN(product.price)) {
    return { valid: false, error: 'Product price must be a non-negative number' };
  }

  if (!product.image || typeof product.image !== 'string' || !product.image.trim()) {
    return { valid: false, error: 'Product image is required and must be a non-empty string' };
  }

  if (product.description !== undefined && (typeof product.description !== 'string')) {
    return { valid: false, error: 'Product description must be a string if provided' };
  }

  return { valid: true };
}

/**
 * Validate array of users
 * @param {any} users - Array to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 */
export function validateUsersArray(users: any): { valid: boolean; error?: string } {
  if (!Array.isArray(users)) {
    return { valid: false, error: 'Users must be an array' };
  }

  for (let i = 0; i < users.length; i++) {
    const validation = validateUser(users[i]);
    if (!validation.valid) {
      return { valid: false, error: `User at index ${i}: ${validation.error}` };
    }
  }

  // Check for duplicate emails
  const emails = users.map((u) => u.email.toLowerCase());
  const uniqueEmails = new Set(emails);
  if (emails.length !== uniqueEmails.size) {
    return { valid: false, error: 'Users array contains duplicate email addresses' };
  }

  return { valid: true };
}

/**
 * Validate array of invoices
 * @param {any} invoices - Array to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 */
export function validateInvoicesArray(invoices: any): { valid: boolean; error?: string } {
  if (!Array.isArray(invoices)) {
    return { valid: false, error: 'Invoices must be an array' };
  }

  for (let i = 0; i < invoices.length; i++) {
    const validation = validateInvoice(invoices[i]);
    if (!validation.valid) {
      return { valid: false, error: `Invoice at index ${i}: ${validation.error}` };
    }
  }

  // Check for duplicate IDs
  const ids = invoices.map((inv) => inv.id).filter(Boolean);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    return { valid: false, error: 'Invoices array contains duplicate IDs' };
  }

  return { valid: true };
}
