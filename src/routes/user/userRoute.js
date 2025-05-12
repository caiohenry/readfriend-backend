// Imports
const express = require('express')
const router = express.Router()

// Controllers
const UserController = require('../../controllers/user/UserController')

// Routes
router.get('/', UserController.index)
router.get('/:id/', UserController.show)
router.post('/create/', UserController.create)
router.put('/update/:id/', UserController.update)
router.delete('/delete/:id/', UserController.delete)

// Export module
module.exports = router
