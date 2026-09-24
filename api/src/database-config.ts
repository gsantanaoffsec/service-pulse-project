import type { Knex } from 'knex'

import { env } from '@/env'

export const databaseConfig: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './db/seeds',
    extension: 'ts',
  },
}
