import type { AuditLogEntry, AuditActionType, DecisionMethod } from '../types/auditLog'
import type { LoanStatus } from '../types/loan'
import { generateId } from './utils'

const AUDIT_STORAGE_KEY = 'tredgate_audit_logs'
const MAX_AUDIT_ENTRIES = 1000 // Prune to this limit

/**
 * Load audit logs from localStorage
 * Returns empty array if nothing is stored
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY)
    if (!stored) {
      return []
    }
    return JSON.parse(stored) as AuditLogEntry[]
  } catch {
    return []
  }
}

/**
 * Persist audit logs to localStorage
 */
export function saveAuditLogs(logs: AuditLogEntry[]): void {
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs))
}

/**
 * Create a new audit log entry
 */
export function createAuditLogEntry(
  action: AuditActionType,
  loanId: string,
  applicantName: string,
  decisionMethod: DecisionMethod,
  description: string,
  previousStatus?: LoanStatus,
  newStatus?: LoanStatus
): AuditLogEntry {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action,
    loanId,
    applicantName,
    previousStatus,
    newStatus,
    decisionMethod,
    description
  }
}

/**
 * Add an audit log entry to storage
 */
export function addAuditLogEntry(entry: AuditLogEntry): void {
  const logs = getAuditLogs()
  logs.push(entry)
  
  // Prune if exceeds max
  const prunedLogs = pruneAuditLogs(logs, MAX_AUDIT_ENTRIES)
  saveAuditLogs(prunedLogs)
}

/**
 * Filter audit logs by various criteria
 */
export function filterAuditLogs(
  logs: AuditLogEntry[],
  criteria: {
    action?: AuditActionType
    loanId?: string
    applicantName?: string
  }
): AuditLogEntry[] {
  return logs.filter(log => {
    if (criteria.action && log.action !== criteria.action) {
      return false
    }
    if (criteria.loanId && log.loanId !== criteria.loanId) {
      return false
    }
    if (criteria.applicantName && log.applicantName !== criteria.applicantName) {
      return false
    }
    return true
  })
}

/**
 * Search audit logs across multiple fields (case-insensitive)
 */
export function searchAuditLogs(logs: AuditLogEntry[], searchTerm: string): AuditLogEntry[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return logs
  }
  
  const term = searchTerm.toLowerCase().trim()
  return logs.filter(log => {
    return (
      log.applicantName.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.loanId.toLowerCase().includes(term) ||
      log.description.toLowerCase().includes(term) ||
      log.previousStatus?.toLowerCase().includes(term) ||
      log.newStatus?.toLowerCase().includes(term)
    )
  })
}

/**
 * Sort audit logs by timestamp (newest first by default)
 */
export function sortAuditLogs(
  logs: AuditLogEntry[],
  order: 'asc' | 'desc' = 'desc'
): AuditLogEntry[] {
  return [...logs].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return order === 'desc' ? timeB - timeA : timeA - timeB
  })
}

/**
 * Prune audit logs to keep only the most recent N entries
 */
export function pruneAuditLogs(logs: AuditLogEntry[], maxEntries: number): AuditLogEntry[] {
  if (logs.length <= maxEntries) {
    return logs
  }
  
  // Sort by timestamp descending and take the first maxEntries
  const sorted = sortAuditLogs(logs, 'desc')
  return sorted.slice(0, maxEntries)
}

/**
 * Audit a loan creation event
 */
export function auditLoanCreated(loanId: string, applicantName: string): void {
  const entry = createAuditLogEntry(
    'loan_created',
    loanId,
    applicantName,
    'n/a',
    `Loan application created for ${applicantName}`
  )
  addAuditLogEntry(entry)
}

/**
 * Audit a manual status change
 */
export function auditStatusChangedManual(
  loanId: string,
  applicantName: string,
  previousStatus: LoanStatus,
  newStatus: LoanStatus
): void {
  const entry = createAuditLogEntry(
    'status_changed_manual',
    loanId,
    applicantName,
    'manual',
    `Status manually changed from ${previousStatus} to ${newStatus}`,
    previousStatus,
    newStatus
  )
  addAuditLogEntry(entry)
}

/**
 * Audit an automatic status change
 */
export function auditStatusChangedAuto(
  loanId: string,
  applicantName: string,
  previousStatus: LoanStatus,
  newStatus: LoanStatus
): void {
  const entry = createAuditLogEntry(
    'status_changed_auto',
    loanId,
    applicantName,
    'auto',
    `Status automatically changed from ${previousStatus} to ${newStatus}`,
    previousStatus,
    newStatus
  )
  addAuditLogEntry(entry)
}
