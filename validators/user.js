const { check } = require('express-validator')
const validate = require('../helpers/validateHelpers')

const validatonCreate = [
  check('username').exists().not().isEmpty().isString(),
  (req, res, next) => {
    validate(req, res, next)
  },
]

module.exports = validatonCreate
