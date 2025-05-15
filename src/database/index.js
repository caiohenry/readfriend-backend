const knexfile = require('../../knexfile')
require('dotenv').config()

const knex = require('knex')(knexfile[process.env.NODE_ENV])
module.exports = knex
