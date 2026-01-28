/**
 * Plain JavaScript utility: format a number as currency.
 * Demonstrates JS fundamentals (no TypeScript).
 * @param {number} amount - Numeric value to format
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} Formatted currency string (e.g. "$1,199")
 */
export function formatCurrency(amount, currency) {
  if (currency === undefined) currency = 'USD';
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
