import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      'tests/failing_heal.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        'tests/**',
        '**/*.config.*',
        '**/main.ts'
      ]
    },
    // Always generate HTML reports for better debugging and CI artifacts
    reporters: ['default', 'html']
  }
})
