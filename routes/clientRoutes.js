const express = require('express')
const router = express.Router()
const clientControllers = require('../controllers/clientControllers')

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser)
  .patch(userControllers.deactivateUser)

module.exports = router
