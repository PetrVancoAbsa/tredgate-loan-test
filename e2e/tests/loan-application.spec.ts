/**
 * E2E Regression Tests for Loan Application
 * Core user journeys and main functionalities
 */

import { test, expect } from '@playwright/test'
import { LoanAppPage } from '../page-objects/loan-app-page'
import { LoanForm } from '../page-objects/loan-form'
import { LoanList } from '../page-objects/loan-list'
import { LoanSummary } from '../page-objects/loan-summary'
import {
  VALID_LOAN_AUTO_APPROVED,
  VALID_LOAN_AUTO_REJECTED,
  VALID_LOAN_MINIMUM,
} from '../test-data/loan-data'
import { TEXTS } from '../test-data/texts'
import {
  formatCurrency,
  formatPercent,
  calculateMonthlyPayment,
  formatCurrencyNoDecimals,
} from '../helpers/format-helpers'

test.describe('Loan Application - Core Functionality', () => {
  let appPage: LoanAppPage
  let loanForm: LoanForm
  let loanList: LoanList
  let loanSummary: LoanSummary

  test.beforeEach(async ({ page }) => {
    appPage = new LoanAppPage(page)
    loanForm = new LoanForm(page)
    loanList = new LoanList(page)
    loanSummary = new LoanSummary(page)

    // Navigate to the application and clear existing data
    await appPage.navigateAndVerifyPage()
    await appPage.clearAllLoans()
  })

  test('should display empty state when no loans exist', async () => {
    // Verify all components are displayed
    await loanForm.verifyFormIsDisplayed()
    await loanList.verifyListIsDisplayed()
    await loanSummary.verifySummaryIsDisplayed()

    // Verify empty state
    await loanList.verifyEmptyState()
    await loanSummary.verifyInitialState()
  })

  test('should create a new loan application successfully', async () => {
    const loanData = VALID_LOAN_AUTO_APPROVED

    // Create loan application
    await loanForm.createLoanApplication(loanData)

    // Verify form is reset
    await loanForm.verifyFormIsReset()

    // Verify loan appears in the list
    await loanList.verifyTableIsDisplayed()

    const count = await loanList.getLoanCount()
    expect(count, 'Should have exactly one loan').toBe(1)

    // Verify loan data
    const row = loanList.getTableRow(0)
    const amount = parseFloat(loanData.amount)
    const term = parseInt(loanData.termMonths)
    const rate = parseFloat(loanData.interestRate)
    const monthlyPayment = calculateMonthlyPayment(amount, term, rate)

    await loanList.verifyLoanData(row, {
      applicantName: loanData.applicantName,
      amount: formatCurrency(amount),
      term: `${term} mo`,
      rate: formatPercent(rate),
      monthlyPayment: formatCurrency(monthlyPayment),
      status: TEXTS.STATUS.PENDING,
    })

    // Verify summary is updated
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '1',
      approved: '0',
      rejected: '0',
      totalApprovedAmount: '$0',
    })
  })

  test('should create multiple loan applications', async () => {
    // Create multiple loans
    await loanForm.createLoanApplication(VALID_LOAN_AUTO_APPROVED)
    await loanForm.createLoanApplication(VALID_LOAN_AUTO_REJECTED)
    await loanForm.createLoanApplication(VALID_LOAN_MINIMUM)

    // Verify all loans are in the list
    const count = await loanList.getLoanCount()
    expect(count, 'Should have three loans').toBe(3)

    // Verify summary
    await loanSummary.verifySummaryStats({
      total: '3',
      pending: '3',
      approved: '0',
      rejected: '0',
      totalApprovedAmount: '$0',
    })
  })

  test('should approve a loan manually', async () => {
    const loanData = VALID_LOAN_AUTO_APPROVED

    // Create loan
    await loanForm.createLoanApplication(loanData)

    // Approve the loan
    await loanList.approveLoanByApplicantName(loanData.applicantName)

    // Verify status changed
    await loanList.verifyLoanStatus(
      loanData.applicantName,
      TEXTS.STATUS.APPROVED
    )

    // Verify summary updated
    const amount = parseFloat(loanData.amount)
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '0',
      approved: '1',
      rejected: '0',
      totalApprovedAmount: formatCurrencyNoDecimals(amount),
    })

    // Verify action buttons are not visible
    const row = loanList.getTableRowByApplicantName(loanData.applicantName)
    await loanList.verifyActionButtonsNotVisible(row)
  })

  test('should reject a loan manually', async () => {
    const loanData = VALID_LOAN_MINIMUM

    // Create loan
    await loanForm.createLoanApplication(loanData)

    // Reject the loan
    await loanList.rejectLoanByApplicantName(loanData.applicantName)

    // Verify status changed
    await loanList.verifyLoanStatus(
      loanData.applicantName,
      TEXTS.STATUS.REJECTED
    )

    // Verify summary updated
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '0',
      approved: '0',
      rejected: '1',
      totalApprovedAmount: '$0',
    })

    // Verify action buttons are not visible
    const row = loanList.getTableRowByApplicantName(loanData.applicantName)
    await loanList.verifyActionButtonsNotVisible(row)
  })

  test('should auto-decide loan for approval (amount <= 100k, term <= 60)', async () => {
    const loanData = VALID_LOAN_AUTO_APPROVED

    // Create loan
    await loanForm.createLoanApplication(loanData)

    // Auto-decide the loan
    await loanList.autoDecideLoanByApplicantName(loanData.applicantName)

    // Verify status changed to approved
    await loanList.verifyLoanStatus(
      loanData.applicantName,
      TEXTS.STATUS.APPROVED
    )

    // Verify summary updated
    const amount = parseFloat(loanData.amount)
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '0',
      approved: '1',
      rejected: '0',
      totalApprovedAmount: formatCurrencyNoDecimals(amount),
    })
  })

  test('should auto-decide loan for rejection (amount > 100k or term > 60)', async () => {
    const loanData = VALID_LOAN_AUTO_REJECTED

    // Create loan
    await loanForm.createLoanApplication(loanData)

    // Auto-decide the loan
    await loanList.autoDecideLoanByApplicantName(loanData.applicantName)

    // Verify status changed to rejected
    await loanList.verifyLoanStatus(
      loanData.applicantName,
      TEXTS.STATUS.REJECTED
    )

    // Verify summary updated
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '0',
      approved: '0',
      rejected: '1',
      totalApprovedAmount: '$0',
    })
  })

  test('should handle mixed loan statuses correctly', async () => {
    // Create three loans
    await loanForm.createLoanApplication(VALID_LOAN_AUTO_APPROVED)
    await loanForm.createLoanApplication(VALID_LOAN_AUTO_REJECTED)
    await loanForm.createLoanApplication(VALID_LOAN_MINIMUM)

    // Approve first loan
    await loanList.approveLoanByApplicantName(
      VALID_LOAN_AUTO_APPROVED.applicantName
    )

    // Reject second loan
    await loanList.rejectLoanByApplicantName(
      VALID_LOAN_AUTO_REJECTED.applicantName
    )

    // Third loan remains pending

    // Verify summary shows correct counts
    const approvedAmount = parseFloat(VALID_LOAN_AUTO_APPROVED.amount)
    await loanSummary.verifySummaryStats({
      total: '3',
      pending: '1',
      approved: '1',
      rejected: '1',
      totalApprovedAmount: formatCurrencyNoDecimals(approvedAmount),
    })

    // Verify each loan has correct status
    await loanList.verifyLoanStatus(
      VALID_LOAN_AUTO_APPROVED.applicantName,
      TEXTS.STATUS.APPROVED
    )
    await loanList.verifyLoanStatus(
      VALID_LOAN_AUTO_REJECTED.applicantName,
      TEXTS.STATUS.REJECTED
    )
    await loanList.verifyLoanStatus(
      VALID_LOAN_MINIMUM.applicantName,
      TEXTS.STATUS.PENDING
    )
  })

  test('should calculate total approved amount correctly with multiple approved loans', async () => {
    // Create and approve multiple loans
    await loanForm.createLoanApplication(VALID_LOAN_AUTO_APPROVED)
    await loanList.approveLoanByApplicantName(
      VALID_LOAN_AUTO_APPROVED.applicantName
    )

    await loanForm.createLoanApplication(VALID_LOAN_MINIMUM)
    await loanList.approveLoanByApplicantName(VALID_LOAN_MINIMUM.applicantName)

    // Calculate expected total
    const totalAmount =
      parseFloat(VALID_LOAN_AUTO_APPROVED.amount) +
      parseFloat(VALID_LOAN_MINIMUM.amount)

    // Verify summary
    await loanSummary.verifySummaryStats({
      total: '2',
      pending: '0',
      approved: '2',
      rejected: '0',
      totalApprovedAmount: formatCurrencyNoDecimals(totalAmount),
    })
  })

  test('should persist loan data after page reload', async () => {
    const loanData = VALID_LOAN_AUTO_APPROVED

    // Create and approve a loan
    await loanForm.createLoanApplication(loanData)
    await loanList.approveLoanByApplicantName(loanData.applicantName)

    // Reload the page
    await appPage.page.reload()
    await appPage.page.waitForLoadState('networkidle')

    // Verify loan is still there with correct status
    await loanList.verifyTableIsDisplayed()
    await loanList.verifyLoanStatus(
      loanData.applicantName,
      TEXTS.STATUS.APPROVED
    )

    // Verify summary
    const amount = parseFloat(loanData.amount)
    await loanSummary.verifySummaryStats({
      total: '1',
      pending: '0',
      approved: '1',
      rejected: '0',
      totalApprovedAmount: formatCurrencyNoDecimals(amount),
    })
  })
})
