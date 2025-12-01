/**
 * Loan Form Component Page Object
 * Handles loan application creation form
 */

import { Page, Locator, expect } from '@playwright/test'
import { TEXTS } from '../test-data/texts'
import type { LoanTestData } from '../test-data/loan-data'

export class LoanForm {
  readonly page: Page

  // Form elements
  readonly formCard: Locator
  readonly formTitle: Locator
  readonly applicantNameInput: Locator
  readonly amountInput: Locator
  readonly termMonthsInput: Locator
  readonly interestRateInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.formCard = page.locator('.loan-form')
    this.formTitle = page.locator('.loan-form h2')
    this.applicantNameInput = page.locator('#applicantName')
    this.amountInput = page.locator('#amount')
    this.termMonthsInput = page.locator('#termMonths')
    this.interestRateInput = page.locator('#interestRate')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('.error-message')
  }

  // ==================== Atomic Methods ====================

  /**
   * Fill applicant name field
   */
  async fillApplicantName(name: string): Promise<void> {
    await this.applicantNameInput.fill(name)
  }

  /**
   * Fill loan amount field
   */
  async fillAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount)
  }

  /**
   * Fill term months field
   */
  async fillTermMonths(term: string): Promise<void> {
    await this.termMonthsInput.fill(term)
  }

  /**
   * Fill interest rate field
   */
  async fillInterestRate(rate: string): Promise<void> {
    await this.interestRateInput.fill(rate)
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click()
  }

  /**
   * Get form title
   */
  getFormTitle(): Locator {
    return this.formTitle
  }

  /**
   * Get error message locator
   */
  getErrorMessage(): Locator {
    return this.errorMessage
  }

  /**
   * Check if form is visible
   */
  async isFormVisible(): Promise<boolean> {
    return await this.formCard.isVisible()
  }

  /**
   * Get applicant name input value
   */
  async getApplicantNameValue(): Promise<string> {
    return await this.applicantNameInput.inputValue()
  }

  /**
   * Get amount input value
   */
  async getAmountValue(): Promise<string> {
    return await this.amountInput.inputValue()
  }

  // ==================== Grouped Actions ====================

  /**
   * Verify form is displayed with correct title
   */
  async verifyFormIsDisplayed(): Promise<void> {
    await expect(
      this.formCard,
      'Loan form should be visible'
    ).toBeVisible()

    await expect(
      this.formTitle,
      `Form title should be "${TEXTS.HEADERS.NEW_LOAN_APPLICATION}"`
    ).toHaveText(TEXTS.HEADERS.NEW_LOAN_APPLICATION)
  }

  /**
   * Fill all form fields with loan data
   */
  async fillLoanForm(loanData: LoanTestData): Promise<void> {
    await this.fillApplicantName(loanData.applicantName)
    await this.fillAmount(loanData.amount)
    await this.fillTermMonths(loanData.termMonths)
    await this.fillInterestRate(loanData.interestRate)
  }

  /**
   * Create a loan application by filling form and submitting
   */
  async createLoanApplication(loanData: LoanTestData): Promise<void> {
    await this.fillApplicantName(loanData.applicantName)
    await this.fillAmount(loanData.amount)
    await this.fillTermMonths(loanData.termMonths)
    await this.fillInterestRate(loanData.interestRate)
    await this.clickSubmit()
    
    // Wait for form to reset (indication of successful submission)
    await expect(
      this.applicantNameInput,
      'Form should be reset after successful submission'
    ).toHaveValue('')
  }

  /**
   * Verify form fields are empty (form reset)
   */
  async verifyFormIsReset(): Promise<void> {
    await expect(
      this.applicantNameInput,
      'Applicant name field should be empty'
    ).toHaveValue('')

    await expect(
      this.amountInput,
      'Amount field should be empty'
    ).toHaveValue('')

    await expect(
      this.termMonthsInput,
      'Term months field should be empty'
    ).toHaveValue('')

    await expect(
      this.interestRateInput,
      'Interest rate field should be empty'
    ).toHaveValue('')
  }
}
