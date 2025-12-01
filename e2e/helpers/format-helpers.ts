/**
 * Helper functions for formatting values in tests
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a number as currency without decimals
 */
export function formatCurrencyNoDecimals(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a decimal as percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Calculate monthly payment for a loan
 */
export function calculateMonthlyPayment(
  amount: number,
  termMonths: number,
  interestRate: number
): number {
  const total = amount * (1 + interestRate)
  return total / termMonths
}
