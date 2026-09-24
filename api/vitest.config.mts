import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*.spec.ts'],
    exclude: ['test/e2e/**'],
  },
})
