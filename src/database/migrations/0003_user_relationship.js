console.log('Migration: USER RELATIONSHIP ')

const { relationship } = require('../../utils/lovs')
const type = relationship.types


// Up model in the database - CREATE TABLE
exports.up = function (knex) {

  // Name of table - user_relationship
  return knex.schema.createTable('user_relationship', function (table) {

    // ID
    table.increments('id').primary()

    // Foreign Key - users
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')

    // Foreign Key - users
    table.integer('friend_id').notNullable()
    table.foreign('friend_id').references('users.id').onDelete('CASCADE')
    table.unique(['user_id', 'friend_id'])

    // Data
    table.enu('type', [...Object.values(type)]).defaultTo(type.SOLICITATION).notNullable();

    // Create and update timestamp
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

  })
  
}


// Down model in the database - DROP TABLE
exports.down = function (knex) {

  return knex.schema.dropTable('user_relationship')

}
