// Imports
const express = require('express')
const router = express.Router()

// Routers
const userRoute = require('./user/userRoute')

// User routes
router.use('/user', userRoute)

// Export
module.exports = router