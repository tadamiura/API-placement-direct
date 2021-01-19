const jwt = require('jsonwebtoken')
const { secret } = require('../helper/service')

const emailValidator = (req, res, next) => {
    const emailRegEx = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/
    if (!emailRegEx.test(req.body.email)) {
      return res.status(400).send('Bad request : email format')
    }
    next()
  }

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      jwt.verify(token, secret, (err, result) => {
        if (err) {
          return res.status(401).send(err.message)
        }
        req.user = result
        next()
      })
    } else {
  
      return res.status(401).send('no token provided')
    }
  }
  
module.exports = { emailValidator, verifyToken }