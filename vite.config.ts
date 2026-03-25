import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitest from 'vitest/config'

export default defineConfig({
  plugins: [react(), vitest()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
