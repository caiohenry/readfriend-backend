// Imports
const express = require('express')
const router = express.Router()

// Controllers
const UserRelationshipController = require('../../controllers/user_relationship/UserRelationshipController')

// Routes
router.get('/', UserRelationshipController.index)
router.get('/solicitation/', UserRelationshipController.solicitation)
router.post('/create/', UserRelationshipController.create)
router.put('/update/:id/', UserRelationshipController.update)
router.delete('/delete/:id/', UserRelationshipController.delete)

// Export module
module.exports = router