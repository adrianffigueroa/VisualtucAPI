const moongoose = require('mongoose')

const clientSchema = new moongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: false },
    companyName: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = moongoose.model('Client', clientSchema)
