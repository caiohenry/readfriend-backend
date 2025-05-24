// Imports
const knex = require('../../database')
const jwt = require('jsonwebtoken')
const { compareSync } = require('bcrypt')

module.exports = {

  // Login
  async login(req, res) {

    try {

      // Get body in the request
      const { email, password } = req.body

      // Get user where email - SELECT WHERE
      let user = await knex
        .select(
          'users.id',
          'users.name',
          'users.email',
          'users.password'
        )
        .from('users')
        .where('email', email)
        .first()

      // Safety
      if (!user) {
        return res.status(400).json({ message: 'user.notfound' })
      } 
      
      // else if (!user.status) {
      //   return res.status(400).json({ message: 'user.inactive'})
      // }

      // Comparing the provided password with the encrypted registered password
      if (compareSync(password, user.password)) {

        // Delete password of data
        delete user.password

        // Token generation
        const token = jwt.sign({ ...user }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_LIFE
        })

        // Token refresh generation
        const refresh_token = jwt.sign({ ...user }, process.env.REFRESH_SECRET, { 
          expiresIn: process.env.REFRESH_LIFE 
        })

        // Delete token where user ID
        await knex('token').where({ user_id: user.id }).del()

        // Create data token 
        await knex('token').insert({
          user_id: user.id,
          token: refresh_token
        })

        // Response data - success
        return res.json({ token, refresh_token, message: 'login.ok' })

      } else {

        // Response data - error
        return res.status(400).json({
          message: 'login.nok'
        })

      }

    } catch (err) {

      console.log(err)

      // Response data - error
      return res.status(400).json({
        message: 'login.error',
        detail: {
          code: err.code,
          message: err.detail,
          constraint: err.constraint?.replaceAll('_', '.'),
          type: typeof err
        }
      })

    }
    
  },

  // Refresh
  async refresh(req, res) {

    try {

      // Get body in the request
      const { refresh_token } = req.body

      // Get token where refresh token - SELECT WHERE
      let token = await knex
        .select()
        .from('token')
        .where({ token: refresh_token })
        .first()

      // If token and refresh token are blank
      if (refresh_token && token) {

        // Decoding token
        const _ = jwt.verify(token.token, process.env.REFRESH_SECRET)
        const decoded = jwt.decode(token.token)

        // Delete IAT and EXP token
        delete decoded.iat
        delete decoded.exp

        // Token generation
        token = jwt.sign({ ...decoded }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_LIFE
        })

        // Response data - success
        return res.json({
          token,
          refresh_token,
          message: 'user.refresh.ok'
        })

      } else {

        // Response data - error
        return res.json({
          message: 'user.refresh.nok'
        })

      }

    } catch (err) {

      // If JWT expired error 
      if (err instanceof jwt.TokenExpiredError) {

        // Response data - error
        return res.status(401).send({
          message: 'user.refresh.expired'
        })

      }

      // Response data - error
      return res.status(400).json({
        message: 'user.refresh.error'
      })

    }

  },

  // Logout
  async logout(req, res) {

    // Get body in the request
    const { refresh_token } = req.body

    try {

      // Delete token where refresh token - SELECT WHERE and DELETE
      await knex('token').where({ token: refresh_token }).del()
      
      // Response data - success
      return res.status(200).send({
        message: 'user.registration.delete.ok'
      })

    } catch (err) {}

    // Response data - success
    return res.status(200).send({
      message: 'user.registration.delete.ok'
    })

  },

  // Auth validate
  async auth(req, res, next) {

    // Get authorization in the headers
    const { authorization } = req.headers

    // If authorization is blank
    if (!authorization) {

      // Response data - error
      return res.status(401).json({
        message: 'authorization.required'
      })

    }

    try {
      
      // Verified token JWT validate
      req.user = jwt.verify(authorization, process.env.TOKEN_SECRET)

    } catch (err) {
      
      // If JWT expired error 
      if (err instanceof jwt.TokenExpiredError) {

        // Response data - error
        return res.status(401).send({
          expired: true,
          message: 'authorization.expired'
        })
      }

      // Response data - error
      return res.status(401).send({
        message: 'authorization.fail'
      })

    }

    next()

  }

}