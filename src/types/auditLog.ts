/**
 * Types of actions that can be audited
 */
export type AuditActionType =
  | 'loan_created'
  | 'status_changed_manual'
  | 'status_changed_auto'

/**
 * Decision method for status changes
 */
export type DecisionMethod = 'manual' | 'auto' | 'n/a'

/**
 * Represents an audit log entry
 */
export interface AuditLogEntry {
  id: string
  timestamp: string         // ISO timestamp
  action: AuditActionType
  loanId: string
  applicantName: string
  previousStatus?: string   // for status changes
  newStatus?: string        // for status changes
  decisionMethod: DecisionMethod
  description: string
}
