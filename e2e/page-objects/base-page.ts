/**
 * Base Page Object
 * Contains common functionality for all page objects
 */

import { Page, Locator, expect } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigate to the application home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, message: string): Promise<void> {
    await expect(locator, `Element should be visible: ${message}`).toBeVisible()
  }

  /**
   * Get text content from element
   */
  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || ''
  }
}
