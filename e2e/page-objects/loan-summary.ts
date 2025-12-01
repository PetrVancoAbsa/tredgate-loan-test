/**
 * Loan Summary Component Page Object
 * Handles summary statistics display
 */

import { Page, Locator, expect } from '@playwright/test'
import { TEXTS } from '../test-data/texts'

export class LoanSummary {
  readonly page: Page

  // Summary elements
  readonly summaryContainer: Locator
  readonly statCards: Locator

  constructor(page: Page) {
    this.page = page
    this.summaryContainer = page.locator('.loan-summary')
    this.statCards = page.locator('.stat-card')
  }

  // ==================== Atomic Methods ====================

  /**
   * Get a stat card by label (using exact match on the label element)
   */
  getStatCardByLabel(label: string): Locator {
    return this.page.locator(`.stat-card:has(.stat-label:text-is("${label}"))`)
  }

  /**
   * Get stat value from a card
   */
  async getStatValue(card: Locator): Promise<string> {
    const value = card.locator('.stat-value')
    return (await value.textContent())?.trim() || ''
  }

  /**
   * Get stat label from a card
   */
  async getStatLabel(card: Locator): Promise<string> {
    const label = card.locator('.stat-label')
    return (await label.textContent())?.trim() || ''
  }

  /**
   * Get total applications count
   */
  async getTotalApplications(): Promise<string> {
    const card = this.getStatCardByLabel(TEXTS.SUMMARY_LABELS.TOTAL_APPLICATIONS)
    return await this.getStatValue(card)
  }

  /**
   * Get pending count
   */
  async getPendingCount(): Promise<string> {
    const card = this.getStatCardByLabel(TEXTS.SUMMARY_LABELS.PENDING)
    return await this.getStatValue(card)
  }

  /**
   * Get approved count
   */
  async getApprovedCount(): Promise<string> {
    const card = this.getStatCardByLabel(TEXTS.SUMMARY_LABELS.APPROVED)
    return await this.getStatValue(card)
  }

  /**
   * Get rejected count
   */
  async getRejectedCount(): Promise<string> {
    const card = this.getStatCardByLabel(TEXTS.SUMMARY_LABELS.REJECTED)
    return await this.getStatValue(card)
  }

  /**
   * Get total approved amount
   */
  async getTotalApprovedAmount(): Promise<string> {
    const card = this.getStatCardByLabel(TEXTS.SUMMARY_LABELS.TOTAL_APPROVED)
    return await this.getStatValue(card)
  }

  // ==================== Grouped Actions ====================

  /**
   * Verify summary is displayed
   */
  async verifySummaryIsDisplayed(): Promise<void> {
    await expect(
      this.summaryContainer,
      'Summary container should be visible'
    ).toBeVisible()

    const cardCount = await this.statCards.count()
    expect(
      cardCount,
      'Summary should contain 5 stat cards'
    ).toBe(5)
  }

  /**
   * Verify all summary statistics
   */
  async verifySummaryStats(expectedStats: {
    total: string
    pending: string
    approved: string
    rejected: string
    totalApprovedAmount: string
  }): Promise<void> {
    const total = await this.getTotalApplications()
    expect(
      total,
      `Total applications should be "${expectedStats.total}"`
    ).toBe(expectedStats.total)

    const pending = await this.getPendingCount()
    expect(
      pending,
      `Pending count should be "${expectedStats.pending}"`
    ).toBe(expectedStats.pending)

    const approved = await this.getApprovedCount()
    expect(
      approved,
      `Approved count should be "${expectedStats.approved}"`
    ).toBe(expectedStats.approved)

    const rejected = await this.getRejectedCount()
    expect(
      rejected,
      `Rejected count should be "${expectedStats.rejected}"`
    ).toBe(expectedStats.rejected)

    const totalApprovedAmount = await this.getTotalApprovedAmount()
    expect(
      totalApprovedAmount,
      `Total approved amount should be "${expectedStats.totalApprovedAmount}"`
    ).toBe(expectedStats.totalApprovedAmount)
  }

  /**
   * Verify initial state (all zeros)
   */
  async verifyInitialState(): Promise<void> {
    await this.verifySummaryStats({
      total: '0',
      pending: '0',
      approved: '0',
      rejected: '0',
      totalApprovedAmount: '$0',
    })
  }
}
