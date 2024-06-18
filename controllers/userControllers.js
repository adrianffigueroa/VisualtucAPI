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
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(users)
})

// @desc Get single user
// @route GET /users
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'User ID required' })
  }
  const user = await User.findById(id).select('-password').exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  res.json(user)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, name, lastname, password, email } = req.body
  if (!username || !name || !lastname || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const duplicate = await User.findOne({ username }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' })
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
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data recived' })
  }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, role, active } = req.body
  if (!id || !username || !role || !active || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }
  user.username = username
  user.role = role
  user.active = active
  if (password) {
    user.password = await bycrypt.hash(password, 10)
  }
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'User ID required' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  const jobs = await Jobs.find({ user: id }).lean().exec()
  if (jobs?.length) {
    return res.status(400).json({ message: 'User has assigned jobs' })
  }
  const result = await user.deleteOne()
  const reply = `Username ${result.username} with ID ${result._id} deleted`
  res.json(reply)
})

// @desc Deactivate a user
// @route PATCH /users/deactivate
// @access Private
const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).json({ message: 'User ID required' })
  }
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
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
