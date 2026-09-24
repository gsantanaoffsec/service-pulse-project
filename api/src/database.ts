import { knex } from 'knex'

import { databaseConfig } from '@/database-config'

export const database = knex(databaseConfig)
