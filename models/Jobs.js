const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const jobsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    finished: { type: Boolean, default: false },
    status: { type: String, default: 'Recibido' },
    price: { type: Number, required: true },
    paymentAdvanced: { type: Number, default: 0 },
    remainingPayment: { type: Number, default: 0 },
  },
  { timestamps: true }
)

jobsSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 1000,
})

module.exports = mongoose.model('Jobs', jobsSchema)
