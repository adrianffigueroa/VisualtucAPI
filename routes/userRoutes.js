const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const validatonCreate = require('../validators/user')

router
  .get('/', userControllers.getAllUsers)
  .get('/getUser/:id', userControllers.getUser)
  .post('/createNewUser', validatonCreate, userControllers.createNewUser)
  .patch('/updateUser', userControllers.updateUser)
  .delete('/deleteUser', userControllers.deleteUser)
  .patch('/deactivateUser', userControllers.deactivateUser)

module.exports = router
