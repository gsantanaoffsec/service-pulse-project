import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ticket_activities', (table) => {
    table.uuid('idactivity').primary()

    table
      .uuid('idticket')
      .notNullable()
      .references('idticket')
      .inTable('tickets')
      .onDelete('CASCADE')

    table.enum('tipo', ['comment', 'diagnosis', 'action']).notNullable()

    table.text('descricao').notNullable()
    table.string('autor').notNullable()

    table.integer('tempoGastoMinutos').nullable()

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    // Criaçao de um índice em uma coluna específica - aceleração de buscas
    table.index('idticket', 'ticket_activities_idticket_index')
    table.index('tipo', 'ticket_activities_tipo_index')
    table.index('autor', 'ticket_activities_autor_index')
    table.index('createdAt', 'ticket_activities_created_at_index')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('ticket_activities')
}
