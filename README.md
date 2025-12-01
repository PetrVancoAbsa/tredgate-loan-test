# Tredgate Loan

A simple loan application management demo built with Vue 3, TypeScript, and Vite.

## Overview

Tredgate Loan is a frontend-only demo application used for training on GitHub Copilot features. It demonstrates a small, realistic frontend project without any backend server or external database.

## Features

- Create loan applications with applicant name, amount, term, and interest rate
- View all loan applications in a table
- Approve or reject loan applications manually
- Auto-decide loans based on simple business rules:
  - Approved if amount ≤ $100,000 AND term ≤ 60 months
  - Rejected otherwise
- Calculate monthly payments
- View summary statistics
- **Audit Log System** - Track all loan application actions with full history

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework with HTML reporting
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

Run all unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

View HTML test report (after running tests):
```bash
npx vite preview --outDir html
```

For detailed test documentation, see [TESTS.md](TESTS.md).

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── assets/           # Global CSS styles
├── components/       # Vue components
│   ├── AuditLog.vue      # Audit log display
│   ├── LoanForm.vue      # Form to create new loans
│   ├── LoanList.vue      # Table of loan applications
│   └── LoanSummary.vue   # Statistics display
├── services/         # Business logic
│   ├── auditLogService.ts # Audit log operations
│   └── loanService.ts     # Loan operations
├── types/            # TypeScript definitions
│   ├── auditLog.ts       # Audit log types
│   └── loan.ts           # Loan domain types
├── App.vue           # Main application component
└── main.ts           # Application entry point
tests/
├── auditLogService.test.ts # Audit log service tests
├── loanService.test.ts     # Business logic tests
├── LoanForm.test.ts        # Form component tests
├── LoanList.test.ts        # List component tests
└── LoanSummary.test.ts     # Summary component tests
```

## Data Persistence

All data is stored in the browser's localStorage. No backend server or external database is used.

- **Loan Applications**: Stored under `tredgate_loans`
- **Audit Log**: Stored under `tredgate_audit_logs`

## Audit Log System

The audit log feature provides complete transparency and traceability for all loan application actions.

### Overview

The audit log automatically tracks all key actions performed on loan applications, storing entries in browser localStorage. Each entry captures detailed information about what happened, when, and how.

### Tracked Events

1. **Loan Created** - When a new loan application is submitted
2. **Status Changed (Manual)** - When a loan is manually approved or rejected
3. **Status Changed (Auto)** - When a loan is automatically decided based on business rules

### Data Model

Each audit log entry contains:

```typescript
interface AuditLogEntry {
  id: string                    // Unique identifier
  timestamp: string             // ISO timestamp
  action: AuditActionType       // Type of action performed
  loanId: string                // Associated loan ID
  applicantName: string         // Name of applicant
  previousStatus?: string       // Previous status (for status changes)
  newStatus?: string            // New status (for status changes)
  decisionMethod: DecisionMethod // 'manual', 'auto', or 'n/a'
  description: string           // Human-readable description
}
```

### UI Features

The Audit Log component provides:

- **Chronological Display**: Shows entries with newest first
- **Search**: Filter by applicant name, action type, loan ID, or description
- **Pagination**: Shows 20 entries by default with "Show More" option
- **Clear Formatting**: Color-coded badges for action types and decision methods
- **Status Change Tracking**: Visual indicator (e.g., "pending → approved")

### Integration Examples

The audit log is automatically integrated into the loan service. To add audit logging to new actions:

```typescript
import { auditLoanCreated, auditStatusChangedManual } from './auditLogService'

// Example: Auditing a loan creation
const newLoan = createLoanApplication(input)
auditLoanCreated(newLoan.id, newLoan.applicantName)

// Example: Auditing a manual status change
const previousStatus = loan.status
loan.status = newStatus
auditStatusChangedManual(loan.id, loan.applicantName, previousStatus, newStatus)
```

### Storage Management

The audit log automatically prunes old entries to maintain performance:
- Maximum entries: 1,000
- Pruning: Automatic when limit is exceeded
- Strategy: Keeps most recent entries

### Testing

All audit log functions are covered by comprehensive unit tests:

```bash
npm run test  # Run all tests including audit log tests
```

Test coverage includes:
- Entry creation and storage
- Filtering by criteria
- Search functionality
- Sorting (ascending/descending)
- Automatic pruning

## License

MIT
