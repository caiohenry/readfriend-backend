// Imports
const express = require('express')
const router = express.Router()

// Controllers
const AuthController = require('../../controllers/auth/AuthController')

// Routes
router.post('/login/', AuthController.login)
router.post('/refresh/', AuthController.refresh)
router.post('/logout/', AuthController.logout)

module.exports = router
