import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getAuditLogs,
  saveAuditLogs,
  createAuditLogEntry,
  addAuditLogEntry,
  filterAuditLogs,
  searchAuditLogs,
  sortAuditLogs,
  pruneAuditLogs,
  auditLoanCreated,
  auditStatusChangedManual,
  auditStatusChangedAuto
} from '../src/services/auditLogService'
import type { AuditLogEntry } from '../src/types/auditLog'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null)
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('auditLogService', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('getAuditLogs', () => {
    it('returns empty array when nothing is stored', () => {
      const logs = getAuditLogs()
      expect(logs).toEqual([])
    })

    it('returns stored audit logs', () => {
      const storedLogs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan1',
          applicantName: 'John Doe',
          decisionMethod: 'n/a',
          description: 'Loan application created'
        }
      ]
      localStorageMock.setItem('tredgate_audit_logs', JSON.stringify(storedLogs))

      const logs = getAuditLogs()
      expect(logs).toEqual(storedLogs)
    })

    it('returns empty array on parse error', () => {
      localStorageMock.setItem('tredgate_audit_logs', 'invalid json')
      const logs = getAuditLogs()
      expect(logs).toEqual([])
    })
  })

  describe('saveAuditLogs', () => {
    it('saves audit logs to localStorage', () => {
      const logs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan1',
          applicantName: 'Jane Doe',
          decisionMethod: 'n/a',
          description: 'Loan created'
        }
      ]

      saveAuditLogs(logs)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tredgate_audit_logs',
        JSON.stringify(logs)
      )
    })
  })

  describe('createAuditLogEntry', () => {
    it('creates an audit log entry with all fields', () => {
      const entry = createAuditLogEntry(
        'status_changed_manual',
        'loan123',
        'Alice Smith',
        'manual',
        'Status changed',
        'pending',
        'approved'
      )

      expect(entry.action).toBe('status_changed_manual')
      expect(entry.loanId).toBe('loan123')
      expect(entry.applicantName).toBe('Alice Smith')
      expect(entry.decisionMethod).toBe('manual')
      expect(entry.description).toBe('Status changed')
      expect(entry.previousStatus).toBe('pending')
      expect(entry.newStatus).toBe('approved')
      expect(entry.id).toBeDefined()
      expect(entry.timestamp).toBeDefined()
    })

    it('creates an audit log entry without status fields', () => {
      const entry = createAuditLogEntry(
        'loan_created',
        'loan456',
        'Bob Jones',
        'n/a',
        'Loan created'
      )

      expect(entry.action).toBe('loan_created')
      expect(entry.loanId).toBe('loan456')
      expect(entry.applicantName).toBe('Bob Jones')
      expect(entry.decisionMethod).toBe('n/a')
      expect(entry.description).toBe('Loan created')
      expect(entry.previousStatus).toBeUndefined()
      expect(entry.newStatus).toBeUndefined()
    })
  })

  describe('addAuditLogEntry', () => {
    it('adds an audit log entry to storage', () => {
      const entry: AuditLogEntry = {
        id: 'test1',
        timestamp: '2024-01-01T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan1',
        applicantName: 'Test User',
        decisionMethod: 'n/a',
        description: 'Test entry'
      }

      addAuditLogEntry(entry)

      const logs = getAuditLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toEqual(entry)
    })

    it('adds multiple entries in sequence', () => {
      const entry1: AuditLogEntry = {
        id: 'test1',
        timestamp: '2024-01-01T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan1',
        applicantName: 'User 1',
        decisionMethod: 'n/a',
        description: 'Entry 1'
      }

      const entry2: AuditLogEntry = {
        id: 'test2',
        timestamp: '2024-01-02T00:00:00.000Z',
        action: 'status_changed_manual',
        loanId: 'loan1',
        applicantName: 'User 1',
        decisionMethod: 'manual',
        description: 'Entry 2',
        previousStatus: 'pending',
        newStatus: 'approved'
      }

      addAuditLogEntry(entry1)
      addAuditLogEntry(entry2)

      const logs = getAuditLogs()
      expect(logs).toHaveLength(2)
      expect(logs[0]).toEqual(entry1)
      expect(logs[1]).toEqual(entry2)
    })
  })

  describe('filterAuditLogs', () => {
    const testLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-01T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan1',
        applicantName: 'Alice',
        decisionMethod: 'n/a',
        description: 'Created'
      },
      {
        id: '2',
        timestamp: '2024-01-02T00:00:00.000Z',
        action: 'status_changed_manual',
        loanId: 'loan2',
        applicantName: 'Bob',
        decisionMethod: 'manual',
        description: 'Approved',
        previousStatus: 'pending',
        newStatus: 'approved'
      },
      {
        id: '3',
        timestamp: '2024-01-03T00:00:00.000Z',
        action: 'status_changed_auto',
        loanId: 'loan1',
        applicantName: 'Alice',
        decisionMethod: 'auto',
        description: 'Auto approved',
        previousStatus: 'pending',
        newStatus: 'approved'
      }
    ]

    it('filters by action', () => {
      const filtered = filterAuditLogs(testLogs, { action: 'loan_created' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.action).toBe('loan_created')
    })

    it('filters by loan id', () => {
      const filtered = filterAuditLogs(testLogs, { loanId: 'loan1' })
      expect(filtered).toHaveLength(2)
      expect(filtered.every(log => log.loanId === 'loan1')).toBe(true)
    })

    it('filters by applicant name', () => {
      const filtered = filterAuditLogs(testLogs, { applicantName: 'Bob' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.applicantName).toBe('Bob')
    })

    it('filters by multiple criteria', () => {
      const filtered = filterAuditLogs(testLogs, {
        loanId: 'loan1',
        action: 'status_changed_auto'
      })
      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.loanId).toBe('loan1')
      expect(filtered[0]?.action).toBe('status_changed_auto')
    })

    it('returns all logs when no criteria provided', () => {
      const filtered = filterAuditLogs(testLogs, {})
      expect(filtered).toHaveLength(3)
    })
  })

  describe('searchAuditLogs', () => {
    const testLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-01T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan1',
        applicantName: 'Alice Smith',
        decisionMethod: 'n/a',
        description: 'Loan application created'
      },
      {
        id: '2',
        timestamp: '2024-01-02T00:00:00.000Z',
        action: 'status_changed_manual',
        loanId: 'loan2',
        applicantName: 'Bob Johnson',
        decisionMethod: 'manual',
        description: 'Manually approved',
        previousStatus: 'pending',
        newStatus: 'approved'
      },
      {
        id: '3',
        timestamp: '2024-01-03T00:00:00.000Z',
        action: 'status_changed_auto',
        loanId: 'loan3',
        applicantName: 'Charlie Brown',
        decisionMethod: 'auto',
        description: 'Auto rejected',
        previousStatus: 'pending',
        newStatus: 'rejected'
      }
    ]

    it('searches by applicant name', () => {
      const results = searchAuditLogs(testLogs, 'Alice')
      expect(results).toHaveLength(1)
      expect(results[0]?.applicantName).toBe('Alice Smith')
    })

    it('searches by action (case insensitive)', () => {
      const results = searchAuditLogs(testLogs, 'CREATED')
      expect(results).toHaveLength(1)
      expect(results[0]?.action).toBe('loan_created')
    })

    it('searches by loan id', () => {
      const results = searchAuditLogs(testLogs, 'loan2')
      expect(results).toHaveLength(1)
      expect(results[0]?.loanId).toBe('loan2')
    })

    it('searches by description', () => {
      const results = searchAuditLogs(testLogs, 'rejected')
      expect(results).toHaveLength(1)
      expect(results[0]?.applicantName).toBe('Charlie Brown')
    })

    it('searches by status', () => {
      const results = searchAuditLogs(testLogs, 'approved')
      expect(results).toHaveLength(1)
      expect(results[0]?.newStatus).toBe('approved')
    })

    it('returns all logs for empty search term', () => {
      const results = searchAuditLogs(testLogs, '')
      expect(results).toHaveLength(3)
    })

    it('returns all logs for whitespace search term', () => {
      const results = searchAuditLogs(testLogs, '   ')
      expect(results).toHaveLength(3)
    })

    it('returns empty array when no matches', () => {
      const results = searchAuditLogs(testLogs, 'xyz123notfound')
      expect(results).toHaveLength(0)
    })
  })

  describe('sortAuditLogs', () => {
    const testLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-03T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan1',
        applicantName: 'User 1',
        decisionMethod: 'n/a',
        description: 'Third'
      },
      {
        id: '2',
        timestamp: '2024-01-01T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan2',
        applicantName: 'User 2',
        decisionMethod: 'n/a',
        description: 'First'
      },
      {
        id: '3',
        timestamp: '2024-01-02T00:00:00.000Z',
        action: 'loan_created',
        loanId: 'loan3',
        applicantName: 'User 3',
        decisionMethod: 'n/a',
        description: 'Second'
      }
    ]

    it('sorts in descending order by default (newest first)', () => {
      const sorted = sortAuditLogs(testLogs)
      expect(sorted[0]?.description).toBe('Third')
      expect(sorted[1]?.description).toBe('Second')
      expect(sorted[2]?.description).toBe('First')
    })

    it('sorts in descending order explicitly', () => {
      const sorted = sortAuditLogs(testLogs, 'desc')
      expect(sorted[0]?.description).toBe('Third')
      expect(sorted[1]?.description).toBe('Second')
      expect(sorted[2]?.description).toBe('First')
    })

    it('sorts in ascending order (oldest first)', () => {
      const sorted = sortAuditLogs(testLogs, 'asc')
      expect(sorted[0]?.description).toBe('First')
      expect(sorted[1]?.description).toBe('Second')
      expect(sorted[2]?.description).toBe('Third')
    })

    it('does not mutate original array', () => {
      const original = [...testLogs]
      sortAuditLogs(testLogs, 'asc')
      expect(testLogs).toEqual(original)
    })
  })

  describe('pruneAuditLogs', () => {
    it('returns all logs when count is less than max', () => {
      const logs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan1',
          applicantName: 'User',
          decisionMethod: 'n/a',
          description: 'Test'
        }
      ]

      const pruned = pruneAuditLogs(logs, 10)
      expect(pruned).toHaveLength(1)
    })

    it('returns all logs when count equals max', () => {
      const logs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan1',
          applicantName: 'User',
          decisionMethod: 'n/a',
          description: 'Test'
        }
      ]

      const pruned = pruneAuditLogs(logs, 1)
      expect(pruned).toHaveLength(1)
    })

    it('prunes to max entries keeping newest', () => {
      const logs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan1',
          applicantName: 'User 1',
          decisionMethod: 'n/a',
          description: 'Oldest'
        },
        {
          id: '2',
          timestamp: '2024-01-02T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan2',
          applicantName: 'User 2',
          decisionMethod: 'n/a',
          description: 'Middle'
        },
        {
          id: '3',
          timestamp: '2024-01-03T00:00:00.000Z',
          action: 'loan_created',
          loanId: 'loan3',
          applicantName: 'User 3',
          decisionMethod: 'n/a',
          description: 'Newest'
        }
      ]

      const pruned = pruneAuditLogs(logs, 2)
      expect(pruned).toHaveLength(2)
      expect(pruned[0]?.description).toBe('Newest')
      expect(pruned[1]?.description).toBe('Middle')
    })
  })

  describe('auditLoanCreated', () => {
    it('creates and stores a loan created audit entry', () => {
      auditLoanCreated('loan123', 'John Doe')

      const logs = getAuditLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]?.action).toBe('loan_created')
      expect(logs[0]?.loanId).toBe('loan123')
      expect(logs[0]?.applicantName).toBe('John Doe')
      expect(logs[0]?.decisionMethod).toBe('n/a')
      expect(logs[0]?.description).toContain('John Doe')
    })
  })

  describe('auditStatusChangedManual', () => {
    it('creates and stores a manual status change audit entry', () => {
      auditStatusChangedManual('loan456', 'Jane Smith', 'pending', 'approved')

      const logs = getAuditLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]?.action).toBe('status_changed_manual')
      expect(logs[0]?.loanId).toBe('loan456')
      expect(logs[0]?.applicantName).toBe('Jane Smith')
      expect(logs[0]?.decisionMethod).toBe('manual')
      expect(logs[0]?.previousStatus).toBe('pending')
      expect(logs[0]?.newStatus).toBe('approved')
      expect(logs[0]?.description).toContain('pending')
      expect(logs[0]?.description).toContain('approved')
    })
  })

  describe('auditStatusChangedAuto', () => {
    it('creates and stores an auto status change audit entry', () => {
      auditStatusChangedAuto('loan789', 'Bob Johnson', 'pending', 'rejected')

      const logs = getAuditLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]?.action).toBe('status_changed_auto')
      expect(logs[0]?.loanId).toBe('loan789')
      expect(logs[0]?.applicantName).toBe('Bob Johnson')
      expect(logs[0]?.decisionMethod).toBe('auto')
      expect(logs[0]?.previousStatus).toBe('pending')
      expect(logs[0]?.newStatus).toBe('rejected')
      expect(logs[0]?.description).toContain('pending')
      expect(logs[0]?.description).toContain('rejected')
    })
  })
})
