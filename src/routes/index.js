// Imports
const express = require('express')
const router = express.Router()

// Middlewares
const authenticated = require('../controllers/auth/AuthController').auth

// Routers
const userRoute = require('./user/userRoute')
const authRoute = require('./auth/authRoute')

// Auth routes
router.use('/auth', authRoute)

// User routes
router.use('/user', authenticated, userRoute)

// Export
module.exports = router