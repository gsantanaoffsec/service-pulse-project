import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tickets', (table) => {
    table.uuid('idticket').primary()

    table.string('titulo').notNullable()
    table.string('descricao').notNullable()

    table
      .enum('categoria', ['Access', 'Hardware', 'Software', 'Network', 'Security', 'Other'])
      .notNullable()

    table.enum('prioridade', ['low', 'medium', 'high', 'critical']).notNullable()

    table
      .enum('status', ['open', 'triage', 'in_progress', 'resolved', 'closed'])
      .notNullable()
      .defaultTo('open')

    table.string('solicitante').notNullable()
    table.string('responsavel').nullable()

    table
      .enum('tipoResolucao', ['fixed', 'workaround', 'no_issue', 'duplicate', 'cancelled'])
      .nullable()

    table.text('resumoResolucao').nullable()

    table.timestamp('resolvedAt').nullable()
    table.timestamp('closedAt').nullable()

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    table.index('status', 'tickets_status_index')
    table.index('categoria', 'tickets_categoria_index')
    table.index('prioridade', 'tickets_prioridade_index')
    table.index('updatedAt', 'tickets_updated_at_index')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tickets')
}
