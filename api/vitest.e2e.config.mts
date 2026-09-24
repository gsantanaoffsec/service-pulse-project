import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['test/e2e/**/*.spec.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: './db/service-pulse-test.sqlite',
    },
  },
})
