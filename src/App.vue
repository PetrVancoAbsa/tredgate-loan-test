<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { LoanApplication } from './types/loan'
import { getLoans, updateLoanStatus, autoDecideLoan } from './services/loanService'
import LoanForm from './components/LoanForm.vue'
import LoanList from './components/LoanList.vue'
import LoanSummary from './components/LoanSummary.vue'

const loans = ref<LoanApplication[]>([])

function refreshLoans() {
  loans.value = getLoans()
}

function handleApprove(id: string) {
  updateLoanStatus(id, 'approved')
  refreshLoans()
}

function handleReject(id: string) {
  updateLoanStatus(id, 'rejected')
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
      <img src="/tredgate-logo-original.png" alt="Tredgate Logo" class="logo" />
      <h1>Tredgate Loan</h1>
      <p class="tagline">Simple loan application management</p>
    </header>

    <LoanSummary :loans="loans" />

    <main class="main-content">
      <div class="left-column">
        <LoanForm @created="refreshLoans" />
      </div>
      <div class="right-column">
        <LoanList
          :loans="loans"
          @approve="handleApprove"
          @reject="handleReject"
          @auto-decide="handleAutoDecide"
        />
      </div>
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
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 0.5rem;
}

.tagline {
  color: var(--tagline-color);
  margin-top: -0.5rem;
  font-size: 1.1rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.left-column {
  flex: 0 0 400px;
}

.right-column {
  flex: 1;
  min-width: 0;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .left-column {
    flex: 1;
    width: 100%;
    max-width: 100%;
  }

  .right-column {
    width: 100%;
  }
}
</style>
