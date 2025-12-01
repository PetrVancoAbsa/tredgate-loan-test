# E2E Tests Documentation

This document describes the end-to-end testing approach using Playwright, test architecture, and how to run and maintain the tests.

## Overview

The project uses **Playwright** for end-to-end testing. Playwright is a modern, reliable testing framework that provides excellent cross-browser support and developer experience.

## Test Architecture

### Page Object Model (POM)

Tests follow the **Page Object Model** pattern with clear separation of concerns:

- **Page Objects** - Encapsulate page structure and interactions
- **Test Data** - Centralized test data and text constants
- **Helpers** - Reusable utility functions
- **Tests** - Test scenarios using page objects

### Best Practices Implemented

1. **Atomic Methods** - Small, focused methods for individual actions
2. **Grouped Actions** - Complex workflows composed from atomic methods
3. **Test Steps** - Only in grouped methods for better readability
4. **Text Library** - No hardcoded strings in tests or page objects
5. **No Test Logic** - All logic encapsulated in page objects and helpers
6. **Custom Messages** - All assertions have descriptive error messages
7. **Unique Locators** - Using IDs and semantic selectors when possible
8. **Isolated Tests** - Each test starts with clean state
9. **Deterministic** - Tests are reliable and repeatable

## Project Structure

```
e2e/
├── helpers/                    # Utility functions
│   ├── format-helpers.ts      # Formatting utilities (currency, dates, etc.)
│   └── storage-helpers.ts     # localStorage management
├── page-objects/              # Page Object Models
│   ├── base-page.ts           # Base page with common functionality
│   ├── loan-app-page.ts       # Main application page
│   ├── loan-form.ts           # Loan creation form
│   ├── loan-list.ts           # Loan list table
│   └── loan-summary.ts        # Summary statistics component
├── test-data/                 # Test data and constants
│   ├── loan-data.ts           # Loan test data scenarios
│   └── texts.ts               # Text constants library
└── tests/                     # Test specifications
    └── loan-application.spec.ts  # Core functionality tests
playwright.config.ts           # Playwright configuration
```

## Test Coverage

### Core User Journeys

The regression test suite covers the following core functionalities:

1. **Empty State Display**
   - Verify initial state with no loans
   - Check empty state messages
   - Validate summary shows zeros

2. **Loan Creation**
   - Fill loan application form
   - Submit and verify loan appears in list
   - Verify form resets after submission
   - Verify summary updates

3. **Multiple Loan Creation**
   - Create multiple loans
   - Verify all appear in list
   - Verify summary counts

4. **Manual Approval**
   - Approve pending loan
   - Verify status change
   - Verify summary updates
   - Verify action buttons disappear

5. **Manual Rejection**
   - Reject pending loan
   - Verify status change
   - Verify summary updates
   - Verify action buttons disappear

6. **Auto-Decision for Approval**
   - Test business rule: amount ≤ $100k AND term ≤ 60 months
   - Verify automatic approval
   - Verify summary updates

7. **Auto-Decision for Rejection**
   - Test business rule: amount > $100k OR term > 60 months
   - Verify automatic rejection
   - Verify summary updates

8. **Mixed Status Scenarios**
   - Multiple loans with different statuses
   - Verify all statuses tracked correctly
   - Verify summary aggregates correctly

9. **Total Approved Amount Calculation**
   - Approve multiple loans
   - Verify total approved amount sums correctly
   - Verify currency formatting

10. **Data Persistence**
    - Create and modify loans
    - Reload page
    - Verify data persists in localStorage
    - Verify all statuses maintained

### Test Data

Pre-defined test data scenarios:

- **Auto-Approved Loan** - Within approval thresholds
- **Auto-Rejected Loan** - Exceeds approval thresholds
- **Minimum Values** - Boundary testing
- **Exact Boundaries** - Edge case testing

## Running Tests

### Prerequisites

```bash
npm install
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

### Run Specific Test File

```bash
npx playwright test e2e/tests/loan-application.spec.ts
```

### Run Single Test by Name

```bash
npx playwright test -g "should create a new loan application"
```

### View HTML Report

After running tests, view the detailed HTML report:

```bash
npx playwright show-report
```

## Configuration

Playwright configuration is in `playwright.config.ts`:

- **Browser**: Chromium (configurable)
- **Base URL**: http://localhost:5173
- **Retries**: 2 retries in CI, 0 locally
- **Parallel Execution**: Disabled in CI for stability
- **Artifacts**: Screenshots on failure, videos on failure, traces on retry
- **Web Server**: Auto-starts dev server before tests

## CI/CD Integration

### GitHub Actions Workflow

The Playwright tests can be triggered manually via GitHub Actions:

1. Go to **Actions** tab in GitHub
2. Select **Playwright E2E Tests** workflow
3. Click **Run workflow**
4. Select browser (chromium or all)
5. Click **Run workflow** button

The workflow will:
- Install dependencies
- Install Playwright browsers
- Run E2E tests
- Upload test reports and artifacts
- Generate test summary

### Workflow Artifacts

After workflow completes:
- **playwright-report** - HTML test report
- **test-results** - Screenshots and videos of failures

## Writing New Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test'
import { LoanAppPage } from '../page-objects/loan-app-page'
import { LoanForm } from '../page-objects/loan-form'
import { VALID_LOAN_AUTO_APPROVED } from '../test-data/loan-data'

test.describe('Feature Name', () => {
  let appPage: LoanAppPage
  let loanForm: LoanForm

  test.beforeEach(async ({ page }) => {
    appPage = new LoanAppPage(page)
    loanForm = new LoanForm(page)
    
    await appPage.navigateAndVerifyPage()
    await appPage.clearAllLoans()
  })

  test('should do something specific', async () => {
    // Arrange - Set up test data and preconditions
    const loanData = VALID_LOAN_AUTO_APPROVED

    // Act - Perform the action being tested
    await loanForm.createLoanApplication(loanData)

    // Assert - Verify the expected outcome
    await loanForm.verifyFormIsReset()
  })
})
```

### Guidelines for New Tests

1. **Use Page Objects** - Never interact with page directly in tests
2. **Use Test Data Constants** - Import from test-data files
3. **Use Text Library** - Import from TEXTS constant
4. **Descriptive Names** - Test names should clearly state what they verify
5. **Arrange-Act-Assert** - Follow AAA pattern
6. **Clean State** - Always start with clean data (use beforeEach)
7. **Custom Messages** - Add descriptive messages to all assertions
8. **Isolated Tests** - Tests should not depend on each other

## Debugging Tests

### Debug in VS Code

1. Set breakpoint in test file
2. Run test in debug mode
3. Step through code and inspect page state

### Debug with Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:
- Step through test actions
- Inspect DOM at each step
- Try locators in console
- View test timeline

### View Trace

After test failure, view trace:

```bash
npx playwright show-trace test-results/.../trace.zip
```

Trace viewer shows:
- Timeline of all actions
- Screenshots at each step
- Network requests
- Console logs
- DOM snapshots

## Troubleshooting

### Tests Fail Locally but Pass in CI

- Ensure you've run `npm ci` to install exact dependency versions
- Check Node.js version matches CI
- Verify Playwright browsers are installed: `npx playwright install`

### Locator Issues

- Use Playwright Inspector to test locators: `npx playwright test --debug`
- Prefer stable locators: IDs, test-ids, semantic role-based selectors
- Avoid CSS selectors based on styling classes

### Flaky Tests

- Add explicit waits for dynamic content
- Use `page.waitForLoadState('networkidle')` after navigation
- Increase timeout for slow operations
- Check for race conditions in test logic

## Maintenance

### When to Update Tests

- **UI Changes** - Update locators and page objects
- **New Features** - Add new test scenarios
- **Business Rules** - Update test data and assertions
- **Bug Fixes** - Add regression tests

### Keeping Tests Healthy

- Run tests regularly during development
- Fix flaky tests immediately
- Update page objects when HTML structure changes
- Keep test data relevant and realistic
- Review and remove obsolete tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)
