console.log('Migration: MESSAGE')


// Up model in the database - CREATE TABLE
exports.up = function (knex) {

  // Name of table - message
  return knex.schema.createTable('message', function (table) {

    // ID
    table.increments('id').primary()

    // Foreign Key - users
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')

    // Create and update timestamp
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

  })
  
}


// Down model in the database - DROP TABLE
exports.down = function (knex) {

  return knex.schema.dropTable('message')

}
