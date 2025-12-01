/**
 * Main Loan Application Page Object
 * Represents the entire loan application page with all components
 */

import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'
import { TEXTS } from '../test-data/texts'
import { clearLoans } from '../helpers/storage-helpers'

export class LoanAppPage extends BasePage {
  // Header elements
  readonly header: Locator
  readonly logo: Locator
  readonly mainTitle: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('.app-header')
    this.logo = page.locator('.logo')
    this.mainTitle = page.locator('.app-header h1')
  }

  // ==================== Atomic Methods ====================

  /**
   * Get the main title locator
   */
  getMainTitle(): Locator {
    return this.mainTitle
  }

  /**
   * Check if logo is visible
   */
  isLogoVisible(): Promise<boolean> {
    return this.logo.isVisible()
  }

  // ==================== Grouped Actions ====================

  /**
   * Navigate to the application and verify page loaded
   */
  async navigateAndVerifyPage(): Promise<void> {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')

    await expect(
      this.mainTitle,
      'Main title should be visible after navigation'
    ).toBeVisible()

    await expect(
      this.mainTitle,
      `Main title should contain "${TEXTS.HEADERS.MAIN_TITLE}"`
    ).toContainText(TEXTS.HEADERS.MAIN_TITLE)
  }

  /**
   * Clear all existing loan data from localStorage
   */
  async clearAllLoans(): Promise<void> {
    await clearLoans(this.page)
    await this.page.reload()
    await this.page.waitForLoadState('networkidle')
  }
}
