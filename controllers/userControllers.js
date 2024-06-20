const User = require('../models/User')
const Jobs = require('../models/Jobs')
const asyncHandler = require('express-async-handler')
const bycrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    return res.status(400).json({ message: 'No hay usuarios registrados' })
  }
  res.json(users)
})

// @desc Get single user
// @route GET /users
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'ID de usuario requerido' })
  }
  const user = await User.findById(id).select('-password').exec()
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' })
  }
  res.json(user)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, name, lastname, password, email } = req.body
  if (!username || !name || !lastname || !password || !email) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  }
  const duplicate = await User.findOne({ username }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Usuario duplicado' })
  }
  const hashedPassword = await bycrypt.hash(password, 10)
  const userObject = {
    username,
    name,
    lastname,
    password: hashedPassword,
    email,
  }
  const user = await User.create(userObject)
  if (user) {
    res.status(201).json({ message: `Nuevo usuario ${username} creado` })
  } else {
    res.status(400).json({ message: 'Datos de usuario invalidos' })
  }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, role, active, name, lastname } = req.body.data
  console.log(req.body.data)
  console.log(id)
  //const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'ID de usuario requerido' })
  }
  if (!name || !lastname || !username || !role) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' })
  }
  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Username duplicado' })
  }
  user.username = username
  user.role = role
  user.active = active
  user.name = name
  user.lastname = lastname
  if (password) {
    user.password = await bycrypt.hash(password, 10)
  }
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} actualizado` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'ID de usuario requerido' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' })
  }
  const jobs = await Jobs.find({ user: id }).lean().exec()
  if (jobs?.length) {
    return res.status(400).json({ message: 'El usuario tiene asignadas tareas' })
  }
  const result = await user.deleteOne()
  const reply = `Username ${result.username} con ID ${result._id} eliminado`
  console.log(reply)
  res.json(reply)
})

// @desc Deactivate a user
// @route PATCH /users/deactivate
// @access Private
const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).json({ message: 'ID de usuario requerido' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' })
  }
  user.active = false
  const result = await user.save()
  res.json(result)
})

module.exports = {
  getUser,
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  deactivateUser,
}
