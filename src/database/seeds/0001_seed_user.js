// Imports
require('dotenv').config()
const { hashSync } = require('bcrypt')

console.log('Seeds: USER')

exports.seed = async function (knex) {
  if (await knex.select('id').from('users').first()) {
    console.log(' - CANCELADO: Esta tabela já foi populada')
    return
  }

  // Users
  const usuarios = await knex('users')
    .insert([
      {
        email: 'testelogin1@gmail.com',
        password: hashSync('root', Number(process.env.SALT)),
        name: 'Teste 1',
        photo: 'Sem tí3.jpeg',
        status: true
      },
      {
        email: 'testelogin2@gmail.com',
        password: hashSync('root', Number(process.env.SALT)),
        name: 'Teste 2',
        photo: 'Sem título.jpeg',
        status: true
      },
      {
        email: 'testelogin3@gmail.com',
        password: hashSync('root', Number(process.env.SALT)),
        name: 'Teste 3',
        photo: 'images.jpeg',
        status: true
      },
      {
        email: 'testelogin4@gmail.com',
        password: hashSync('root', Number(process.env.SALT)),
        name: 'Teste 4',
        photo: 'Sem tí3.jpeg',
        status: true
      },
      {
        email: 'testelogin5@gmail.com',
        password: hashSync('root', Number(process.env.SALT)),
        name: 'Teste 5',
        photo: '3título.jpeg',
        status: true
      }
    ])
    .returning('id')

}