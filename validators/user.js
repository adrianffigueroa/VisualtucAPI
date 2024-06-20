const { check } = require('express-validator')
const validate = require('../helpers/validateHelpers')

const validatonCreate = [
  check('username')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3, max: 32 }),
  check('name')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3, max: 32 }),
  check('lastname')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3, max: 32 }),
  check('password').exists().not().isEmpty().isString(),
  check('email').exists().not().isEmpty().isEmail(),
  check('role')
    .exists()
    .not()
    .isEmpty()
    .isIn(['Administrador', 'Manager', 'Empleado']),

  (req, res, next) => {
    validate(req, res, next)
  },
]

module.exports = validatonCreate
