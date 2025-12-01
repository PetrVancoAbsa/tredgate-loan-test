/**
 * Test data for loan applications
 */

export interface LoanTestData {
  applicantName: string
  amount: string
  termMonths: string
  interestRate: string
}

/**
 * Valid loan data that should be auto-approved
 * (amount <= 100000 AND term <= 60)
 */
export const VALID_LOAN_AUTO_APPROVED: LoanTestData = {
  applicantName: 'John Smith',
  amount: '50000',
  termMonths: '36',
  interestRate: '0.08',
}

/**
 * Valid loan data that should be auto-rejected
 * (amount > 100000 OR term > 60)
 */
export const VALID_LOAN_AUTO_REJECTED: LoanTestData = {
  applicantName: 'Jane Doe',
  amount: '150000',
  termMonths: '72',
  interestRate: '0.10',
}

/**
 * Valid loan data with minimum values
 */
export const VALID_LOAN_MINIMUM: LoanTestData = {
  applicantName: 'Bob Johnson',
  amount: '1000',
  termMonths: '12',
  interestRate: '0.05',
}

/**
 * Valid loan data at the boundary for auto-approval
 */
export const VALID_LOAN_BOUNDARY_APPROVED: LoanTestData = {
  applicantName: 'Alice Williams',
  amount: '100000',
  termMonths: '60',
  interestRate: '0.07',
}

/**
 * Valid loan data just over the boundary (should be rejected)
 */
export const VALID_LOAN_BOUNDARY_REJECTED_AMOUNT: LoanTestData = {
  applicantName: 'Charlie Brown',
  amount: '100001',
  termMonths: '60',
  interestRate: '0.06',
}

export const VALID_LOAN_BOUNDARY_REJECTED_TERM: LoanTestData = {
  applicantName: 'Diana Prince',
  amount: '100000',
  termMonths: '61',
  interestRate: '0.09',
}
