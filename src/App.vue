<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { LoanApplication, LoanStatus } from './types/loan'
import { getLoans, updateLoanStatus, autoDecideLoan } from './services/loanService'
import LoanForm from './components/LoanForm.vue'
import LoanList from './components/LoanList.vue'
import LoanSummary from './components/LoanSummary.vue'

const loans = ref<LoanApplication[]>([])

function refreshLoans() {
  loans.value = getLoans()
}

function handleApprove(id: string) {
  updateLoanStatus(id, 'approved' as LoanStatus)
  refreshLoans()
}

function handleReject(id: string) {
  updateLoanStatus(id, 'rejected' as LoanStatus)
  refreshLoans()
}

function handleAutoDecide(id: string) {
  autoDecideLoan(id)
  refreshLoans()
}

onMounted(() => {
  refreshLoans()
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Tredgate Loan</h1>
      <p class="tagline">Simple loan application management</p>
    </header>

    <LoanSummary :loans="loans" />

    <main class="main-content">
      <LoanForm @created="refreshLoans" />
      <LoanList
        :loans="loans"
        @approve="handleApprove"
        @reject="handleReject"
        @auto-decide="handleAutoDecide"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tagline {
  color: var(--text-secondary);
  margin-top: -0.5rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .main-content > :first-child {
    max-width: 100%;
    width: 100%;
  }
}
</style>
