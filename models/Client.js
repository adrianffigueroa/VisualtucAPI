const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: false },
    companyName: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' }],
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

module.exports = moongoose.model('Client', clientSchema)
