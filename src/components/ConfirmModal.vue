<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="emit('cancel')">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="emit('cancel')">Cancel</button>
          <button class="btn-delete" @click="emit('confirm')">Delete</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.modal-message {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-ghost {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-ghost:hover {
  background-color: #f8f9fa;
  border-color: var(--text-secondary);
}

.btn-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--danger-color);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-delete:active {
  transform: scale(0.98);
}
</style>
