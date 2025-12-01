/**
 * Text library for E2E tests
 * Centralized location for all text constants used in tests
 */

export const TEXTS = {
  HEADERS: {
    MAIN_TITLE: 'Tredgate Loan',
    NEW_LOAN_APPLICATION: 'New Loan Application',
    LOAN_APPLICATIONS: 'Loan Applications',
  },

  LABELS: {
    APPLICANT_NAME: 'Applicant Name',
    LOAN_AMOUNT: 'Loan Amount ($)',
    TERM_MONTHS: 'Term (Months)',
    INTEREST_RATE: 'Interest Rate (e.g., 0.08 for 8%)',
  },

  BUTTONS: {
    CREATE_APPLICATION: 'Create Application',
  },

  TABLE_HEADERS: {
    APPLICANT: 'Applicant',
    AMOUNT: 'Amount',
    TERM: 'Term',
    RATE: 'Rate',
    MONTHLY_PAYMENT: 'Monthly Payment',
    STATUS: 'Status',
    CREATED: 'Created',
    ACTIONS: 'Actions',
  },

  STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },

  SUMMARY_LABELS: {
    TOTAL_APPLICATIONS: 'Total Applications',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    TOTAL_APPROVED: 'Total Approved',
  },

  MESSAGES: {
    NO_APPLICATIONS: 'No loan applications yet. Create one using the form.',
  },

  PLACEHOLDERS: {
    APPLICANT_NAME: 'Enter applicant name',
    LOAN_AMOUNT: 'Enter loan amount',
    TERM_MONTHS: 'Enter term in months',
    INTEREST_RATE: 'Enter interest rate',
  },

  TOOLTIPS: {
    APPROVE: 'Approve',
    REJECT: 'Reject',
    AUTO_DECIDE: 'Auto-decide',
  },
}
