require('dotenv').config()

const port = process.env.PORT
const secret = process.env.JWT_SECRET

module.exports = { port, secret }
