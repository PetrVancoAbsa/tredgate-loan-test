/**
 * Helper functions for managing localStorage in tests
 */

import { Page } from '@playwright/test'

const STORAGE_KEY = 'tredgate_loans'

/**
 * Clear all loans from localStorage
 */
export async function clearLoans(page: Page): Promise<void> {
  await page.evaluate((key) => {
    localStorage.removeItem(key)
  }, STORAGE_KEY)
}

/**
 * Get all loans from localStorage
 */
export async function getLoans(page: Page): Promise<any[]> {
  return await page.evaluate((key) => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }, STORAGE_KEY)
}
