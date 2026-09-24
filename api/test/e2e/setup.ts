import { knex } from 'knex'

import { databaseConfig } from '@/database-config'

const testDatabase = knex({
  ...databaseConfig,
  connection: {
    filename: './db/service-pulse-test.sqlite',
  },
})

async function setupDatabase() {
  await testDatabase.migrate.latest()
  await testDatabase.destroy()
}

setupDatabase().catch((error) => {
  console.error(error)
  process.exit(1)
})
