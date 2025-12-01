/**
 * Loan List Component Page Object
 * Handles loan applications table and actions
 */

import { Page, Locator, expect } from '@playwright/test'
import { TEXTS } from '../test-data/texts'

export class LoanList {
  readonly page: Page

  // List elements
  readonly listCard: Locator
  readonly listTitle: Locator
  readonly emptyState: Locator
  readonly table: Locator
  readonly tableRows: Locator

  constructor(page: Page) {
    this.page = page
    this.listCard = page.locator('.loan-list')
    this.listTitle = page.locator('.loan-list h2')
    this.emptyState = page.locator('.empty-state')
    this.table = page.locator('.loan-list table')
    this.tableRows = page.locator('.loan-list tbody tr')
  }

  // ==================== Atomic Methods ====================

  /**
   * Get list title
   */
  getListTitle(): Locator {
    return this.listTitle
  }

  /**
   * Get empty state message
   */
  getEmptyState(): Locator {
    return this.emptyState
  }

  /**
   * Check if table is visible
   */
  async isTableVisible(): Promise<boolean> {
    return await this.table.isVisible()
  }

  /**
   * Get number of loan rows in the table
   */
  async getLoanCount(): Promise<number> {
    return await this.tableRows.count()
  }

  /**
   * Get a specific table row by index (0-based)
   */
  getTableRow(index: number): Locator {
    return this.tableRows.nth(index)
  }

  /**
   * Get table row by applicant name
   */
  getTableRowByApplicantName(name: string): Locator {
    return this.page.locator(`tbody tr:has-text("${name}")`)
  }

  /**
   * Get cell value from a specific row and column
   */
  async getCellValue(row: Locator, columnIndex: number): Promise<string> {
    const cell = row.locator('td').nth(columnIndex)
    return (await cell.textContent())?.trim() || ''
  }

  /**
   * Get applicant name from row
   */
  async getApplicantName(row: Locator): Promise<string> {
    return await this.getCellValue(row, 0)
  }

  /**
   * Get amount from row
   */
  async getAmount(row: Locator): Promise<string> {
    return await this.getCellValue(row, 1)
  }

  /**
   * Get term from row
   */
  async getTerm(row: Locator): Promise<string> {
    return await this.getCellValue(row, 2)
  }

  /**
   * Get rate from row
   */
  async getRate(row: Locator): Promise<string> {
    return await this.getCellValue(row, 3)
  }

  /**
   * Get monthly payment from row
   */
  async getMonthlyPayment(row: Locator): Promise<string> {
    return await this.getCellValue(row, 4)
  }

  /**
   * Get status badge from row
   */
  getStatusBadge(row: Locator): Locator {
    return row.locator('.status-badge')
  }

  /**
   * Get status text from row
   */
  async getStatus(row: Locator): Promise<string> {
    const badge = this.getStatusBadge(row)
    return (await badge.textContent())?.trim() || ''
  }

  /**
   * Get approve button for a row
   */
  getApproveButton(row: Locator): Locator {
    return row.locator('button.success')
  }

  /**
   * Get reject button for a row
   */
  getRejectButton(row: Locator): Locator {
    return row.locator('button.danger')
  }

  /**
   * Get auto-decide button for a row
   */
  getAutoDecideButton(row: Locator): Locator {
    return row.locator('button.secondary')
  }

  /**
   * Click approve button for a specific row
   */
  async clickApprove(row: Locator): Promise<void> {
    await this.getApproveButton(row).click()
  }

  /**
   * Click reject button for a specific row
   */
  async clickReject(row: Locator): Promise<void> {
    await this.getRejectButton(row).click()
  }

  /**
   * Click auto-decide button for a specific row
   */
  async clickAutoDecide(row: Locator): Promise<void> {
    await this.getAutoDecideButton(row).click()
  }

  // ==================== Grouped Actions ====================

  /**
   * Verify list is displayed with correct title
   */
  async verifyListIsDisplayed(): Promise<void> {
    await expect(
      this.listCard,
      'Loan list should be visible'
    ).toBeVisible()

    await expect(
      this.listTitle,
      `List title should be "${TEXTS.HEADERS.LOAN_APPLICATIONS}"`
    ).toHaveText(TEXTS.HEADERS.LOAN_APPLICATIONS)
  }

  /**
   * Verify empty state is shown when no loans exist
   */
  async verifyEmptyState(): Promise<void> {
    await expect(
      this.emptyState,
      'Empty state should be visible when no loans exist'
    ).toBeVisible()

    await expect(
      this.emptyState,
      `Empty state should contain message "${TEXTS.MESSAGES.NO_APPLICATIONS}"`
    ).toContainText(TEXTS.MESSAGES.NO_APPLICATIONS)
  }

  /**
   * Verify table is displayed with loans
   */
  async verifyTableIsDisplayed(): Promise<void> {
    await expect(
      this.table,
      'Loan table should be visible'
    ).toBeVisible()

    const count = await this.getLoanCount()
    expect(count, 'Table should contain at least one loan').toBeGreaterThan(0)
  }

  /**
   * Verify loan data in a specific row
   */
  async verifyLoanData(
    row: Locator,
    expectedData: {
      applicantName: string
      amount: string
      term: string
      rate: string
      monthlyPayment: string
      status: string
    }
  ): Promise<void> {
    const applicantName = await this.getApplicantName(row)
    expect(
      applicantName,
      `Applicant name should be "${expectedData.applicantName}"`
    ).toBe(expectedData.applicantName)

    const amount = await this.getAmount(row)
    expect(
      amount,
      `Amount should be "${expectedData.amount}"`
    ).toBe(expectedData.amount)

    const term = await this.getTerm(row)
    expect(
      term,
      `Term should be "${expectedData.term}"`
    ).toBe(expectedData.term)

    const rate = await this.getRate(row)
    expect(
      rate,
      `Rate should be "${expectedData.rate}"`
    ).toBe(expectedData.rate)

    const monthlyPayment = await this.getMonthlyPayment(row)
    expect(
      monthlyPayment,
      `Monthly payment should be "${expectedData.monthlyPayment}"`
    ).toBe(expectedData.monthlyPayment)

    const status = await this.getStatus(row)
    expect(
      status,
      `Status should be "${expectedData.status}"`
    ).toBe(expectedData.status)
  }

  /**
   * Approve a loan by applicant name
   */
  async approveLoanByApplicantName(name: string): Promise<void> {
    const row = this.getTableRowByApplicantName(name)
    await expect(
      row,
      `Row with applicant "${name}" should be visible`
    ).toBeVisible()

    await this.clickApprove(row)

    // Wait for status to update
    await this.page.waitForTimeout(500)
  }

  /**
   * Reject a loan by applicant name
   */
  async rejectLoanByApplicantName(name: string): Promise<void> {
    const row = this.getTableRowByApplicantName(name)
    await expect(
      row,
      `Row with applicant "${name}" should be visible`
    ).toBeVisible()

    await this.clickReject(row)

    // Wait for status to update
    await this.page.waitForTimeout(500)
  }

  /**
   * Auto-decide a loan by applicant name
   */
  async autoDecideLoanByApplicantName(name: string): Promise<void> {
    const row = this.getTableRowByApplicantName(name)
    await expect(
      row,
      `Row with applicant "${name}" should be visible`
    ).toBeVisible()

    await this.clickAutoDecide(row)

    // Wait for status to update
    await this.page.waitForTimeout(500)
  }

  /**
   * Verify loan status by applicant name
   */
  async verifyLoanStatus(name: string, expectedStatus: string): Promise<void> {
    const row = this.getTableRowByApplicantName(name)
    await expect(
      row,
      `Row with applicant "${name}" should be visible`
    ).toBeVisible()

    const status = await this.getStatus(row)
    expect(
      status,
      `Loan for "${name}" should have status "${expectedStatus}"`
    ).toBe(expectedStatus)
  }

  /**
   * Verify action buttons are visible for pending loan
   */
  async verifyActionButtonsVisible(row: Locator): Promise<void> {
    await expect(
      this.getApproveButton(row),
      'Approve button should be visible for pending loan'
    ).toBeVisible()

    await expect(
      this.getRejectButton(row),
      'Reject button should be visible for pending loan'
    ).toBeVisible()

    await expect(
      this.getAutoDecideButton(row),
      'Auto-decide button should be visible for pending loan'
    ).toBeVisible()
  }

  /**
   * Verify action buttons are not visible for non-pending loan
   */
  async verifyActionButtonsNotVisible(row: Locator): Promise<void> {
    const approveButton = this.getApproveButton(row)
    const count = await approveButton.count()
    expect(
      count,
      'Approve button should not be visible for non-pending loan'
    ).toBe(0)
  }
}
