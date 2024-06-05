const moongoose = require('mongoose')

const connectDB = async () => {
  try {
    await moongoose.connect(process.env.DATABASE_URI)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB
