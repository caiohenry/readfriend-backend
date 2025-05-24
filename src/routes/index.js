// Imports
const express = require('express')
const router = express.Router()
const { uploader } = require('../middlewares/files')

// Middlewares
const authenticated = require('../controllers/auth/AuthController').auth
const UserController = require('../controllers/user/UserController')

// Routers
const userRoute = require('./user/userRoute')
const userRelationshipRoute = require('./user_relationship/userRelationshipRoute')
const authRoute = require('./auth/authRoute')

// Auth routes
router.use('/auth', authRoute)

// User routes
router.post('/user/external-create/', uploader.single('photo'), UserController.externalCreate )
router.use('/user', authenticated, userRoute)

// User relationship routes
router.use('/user-relationship', authenticated, userRelationshipRoute)


// Export
module.exports = router