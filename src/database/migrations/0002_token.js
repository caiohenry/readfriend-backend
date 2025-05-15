console.log('Migration: TOKEN')


// Up model in the database - CREATE TABLE
exports.up = function (knex) {

  // Name of table - token
  return knex.schema.createTable('token', function (table) {

    // ID
    table.increments('id').primary()

    // Foreign Key - users
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')

    // Data token
    table.string('token', 1024).notNullable()

    // Create and update timestamp
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

  })
  
}


// Down model in the database - DROP TABLE
exports.down = function (knex) {

  return knex.schema.dropTable('token')

}
