# Test Documentation

This document describes the testing approach, how to run tests, and what each test suite covers.

## Overview

The project uses **Vitest** as the testing framework. Vitest is a fast, modern unit testing framework that works seamlessly with Vite and Vue 3. It provides Jest-compatible APIs and excellent TypeScript support.

## Test Coverage

All application features are covered by unit tests organized into four test suites:

### 1. loanService.test.ts
Tests the core business logic in `src/services/loanService.ts`

**Functions tested:**
- `getLoans()` - Loading loans from localStorage
- `saveLoans()` - Persisting loans to localStorage
- `createLoanApplication()` - Creating new loan applications with validation
- `updateLoanStatus()` - Updating loan status by ID
- `calculateMonthlyPayment()` - Calculating monthly payment amounts
- `autoDecideLoan()` - Auto-approval/rejection based on business rules

**Test count:** 19 tests

### 2. LoanForm.test.ts
Tests the loan application form component at `src/components/LoanForm.vue`

**Features tested:**
- Form rendering with all required input fields
- Form validation (required fields, numeric constraints)
- Error message display for invalid inputs
- Successful loan creation
- Form reset after submission
- Event emission to parent component
- Error handling when service fails
- Input sanitization (trimming whitespace)

**Test count:** 13 tests

### 3. LoanList.test.ts
Tests the loan applications table component at `src/components/LoanList.vue`

**Features tested:**
- Empty state display
- Table rendering with correct headers
- Loan data display in table rows
- Currency and percentage formatting
- Date formatting
- Monthly payment calculation display
- Status badges with correct styling
- Action buttons (approve, reject, auto-decide)
- Button visibility based on loan status
- Event emission for user actions
- Multiple loans rendering

**Test count:** 20 tests

### 4. LoanSummary.test.ts
Tests the statistics summary component at `src/components/LoanSummary.vue`

**Features tested:**
- All stat cards rendering
- Total applications count
- Pending, approved, rejected counts
- Total approved amount calculation
- Currency formatting with thousands separator
- Zero state handling
- Reactive updates when data changes
- Large number formatting

**Test count:** 13 tests

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### View HTML test report
After running tests, an HTML report is generated in the `html/` directory.

To view it:
```bash
npx vite preview --outDir html
```
Then open your browser to the displayed URL (usually http://localhost:4173).

### Run tests with coverage (optional)
```bash
npx vitest run --coverage
```

## Test Architecture

### Isolation and Mocking
- **localStorage** is mocked in `loanService.test.ts` to isolate tests from browser storage
- **loanService** functions are mocked in component tests to isolate UI logic from business logic
- Each test starts with a clean state using `beforeEach()` hooks

### Component Testing
- Uses `@vue/test-utils` for mounting and interacting with Vue components
- Tests verify both rendering and user interactions
- Event emissions are tested to ensure proper parent-child communication

### Best Practices
- **Descriptive test names** - Each test clearly states what it's testing
- **Arrange-Act-Assert pattern** - Tests are structured logically
- **Independence** - Tests don't depend on each other and can run in any order
- **Single responsibility** - Each test verifies one specific behavior
- **Complete coverage** - All functions, methods, and UI interactions are tested

## Continuous Integration

Tests run automatically on:
- All pull requests to the main branch
- All pushes to the main branch

The CI workflow:
1. Sets up Node.js environment
2. Installs dependencies
3. Runs linter
4. Runs all tests
5. Generates HTML test report
6. Uploads report as artifact
7. Displays summary in workflow run

See `.github/workflows/ci.yml` for workflow configuration.

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure you've run `npm ci` to install exact dependency versions
- Check Node.js version matches CI (LTS version recommended)

### HTML report not generated
- Ensure you run `npm test` at least once
- Check that `html/` directory exists after test run
- Verify `vitest.config.ts` has `reporters: ['default', 'html']`

### Mock errors in tests
- Make sure to clear mocks in `beforeEach()` hooks
- Use `vi.clearAllMocks()` to reset all mock state

## Adding New Tests

When adding new features:

1. **For new service functions:**
   - Add tests to `tests/loanService.test.ts`
   - Test happy path and all error cases
   - Mock localStorage interactions

2. **For new components:**
   - Create new test file: `tests/ComponentName.test.ts`
   - Test rendering, user interactions, and events
   - Mock external dependencies (services, etc.)

3. **Test structure template:**
   ```typescript
   import { describe, it, expect, beforeEach, vi } from 'vitest'
   
   describe('FeatureName', () => {
     beforeEach(() => {
       // Setup code
     })
   
     it('should do something specific', () => {
       // Arrange
       // Act
       // Assert
     })
   })
   ```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
