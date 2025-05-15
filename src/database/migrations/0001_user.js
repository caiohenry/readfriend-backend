// Migration message
console.log('Migration: USER')


// Up model in the database - CREATE TABLE
exports.up = function (knex) {

    // Name of table - users
    return knex.schema.createTable('users', function (table) {

        // ID
        table.increments('id').primary()

        // Access
        table.string('email', 100).unique().notNullable()
        table.string('password', 100).notNullable()

        // Data
        table.string('name', 100).notNullable()
        table.string('cpf', 14).unique().notNullable()
        table.string('phone', 30)
        table.boolean('status').notNullable().defaultTo(false)

        // Create and update timestamp
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

    })

}


// Down model in the database - DROP TABLE
exports.down = function (knex) {

    return knex.schema.dropTable('users')

}
