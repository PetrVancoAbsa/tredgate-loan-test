<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { AuditLogEntry } from '../types/auditLog'
import { getAuditLogs, searchAuditLogs, sortAuditLogs } from '../services/auditLogService'

const allLogs = ref<AuditLogEntry[]>([])
const searchTerm = ref('')
const displayLimit = ref(20)

function refreshLogs() {
  allLogs.value = getAuditLogs()
}

const filteredAndSortedLogs = computed(() => {
  let logs = allLogs.value
  
  // Apply search
  logs = searchAuditLogs(logs, searchTerm.value)
  
  // Sort by timestamp (newest first)
  logs = sortAuditLogs(logs, 'desc')
  
  return logs
})

const displayedLogs = computed(() => {
  return filteredAndSortedLogs.value.slice(0, displayLimit.value)
})

const hasMoreLogs = computed(() => {
  return filteredAndSortedLogs.value.length > displayLimit.value
})

function showMore() {
  displayLimit.value += 20
}

function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function formatAction(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatStatusChange(entry: AuditLogEntry): string {
  if (entry.previousStatus && entry.newStatus) {
    return `${entry.previousStatus} → ${entry.newStatus}`
  }
  return '—'
}

onMounted(() => {
  refreshLogs()
})

defineExpose({ refreshLogs })
</script>

<template>
  <div class="audit-log card">
    <h2>Audit Log</h2>
    
    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name, action, loan ID, or description..."
        class="search-input"
      />
    </div>

    <div v-if="displayedLogs.length === 0" class="empty-state">
      <p v-if="searchTerm">No audit entries match your search.</p>
      <p v-else>No audit entries yet. Actions will be logged here.</p>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Applicant</th>
            <th>Status Change</th>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in displayedLogs" :key="entry.id">
            <td class="timestamp">{{ formatTimestamp(entry.timestamp) }}</td>
            <td>
              <span :class="['action-badge', `action-${entry.action}`]">
                {{ formatAction(entry.action) }}
              </span>
            </td>
            <td>{{ entry.applicantName }}</td>
            <td>{{ formatStatusChange(entry) }}</td>
            <td>
              <span :class="['method-badge', `method-${entry.decisionMethod}`]">
                {{ entry.decisionMethod }}
              </span>
            </td>
            <td class="description">{{ entry.description }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="hasMoreLogs" class="show-more">
        <button @click="showMore" class="btn-secondary">
          Show More ({{ filteredAndSortedLogs.length - displayLimit }} remaining)
        </button>
      </div>
    </div>

    <div v-if="allLogs.length > 0" class="audit-summary">
      Showing {{ displayedLogs.length }} of {{ filteredAndSortedLogs.length }} entries
      <span v-if="searchTerm">(filtered from {{ allLogs.length }} total)</span>
    </div>
  </div>
</template>

<style scoped>
.audit-log {
  margin-top: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: var(--background-light);
  border-bottom: 2px solid var(--border-color);
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-light);
}

.timestamp {
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.description {
  max-width: 300px;
}

.action-badge,
.method-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.action-badge {
  background-color: var(--status-pending-bg);
  color: var(--status-pending-text);
}

.action-loan_created {
  background-color: #e3f2fd;
  color: #1976d2;
}

.action-status_changed_manual {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.action-status_changed_auto {
  background-color: #fff3e0;
  color: #e65100;
}

.method-badge {
  background-color: var(--background-light);
  color: var(--text-secondary);
}

.method-manual {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.method-auto {
  background-color: #fff3e0;
  color: #e65100;
}

.method-n\/a {
  background-color: var(--background-light);
  color: var(--text-secondary);
}

.show-more {
  margin-top: 1rem;
  text-align: center;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--background-light);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.audit-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
