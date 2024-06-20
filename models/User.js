const moongoose = require('mongoose')

const userSchema = new moongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ['Administrador', 'Manager', 'Empleado'],
      default: 'Empleado',
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

module.exports = moongoose.model('User', userSchema)
