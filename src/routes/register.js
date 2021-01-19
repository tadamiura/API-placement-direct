const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { connection } = require('../helper/conf')
const { emailValidator } = require('../helper/auth.service')

const router = express.Router()

const checkUser = (req, res, next) => {
	const mail = req.body.email
	connection.query('SELECT * FROM user WHERE email = ?', mail, (err, result) => {
		if (err) {
            console.log('checkUser', err)
            return res.status(500).send('Internal server error')
		} else if (result.length>0) {
			return res.status(409).send('User already exists')
		}
		// If we use register in another goal, we may change or create a const createUser for this variable
		const user = {
		name: req.body.name,
		lastname: req.body.lastname,
		email : req.body.email,
		password: bcrypt.hashSync(req.body.password)
		}
		req.user = user
		next()
	})
}

const registerUserDb = (req, res, next) => {
	  connection.query('INSERT INTO user SET ?', req.user, (err, result) => {
			if (err) {
                console.log('resgiterUserDb 1', err)
				return res.status(500).send('Cannot register the user')
			}
			connection.query('SELECT id, name, lastname, email FROM user WHERE id = ?', result.insertId, (err, result) => {
				if (err) {
                    console.log('resgiterUserDb 2')
					return res.status(500).send('Internal server error')
				}
				// If all went well, records is an array, from which we use the 1st item
				const insertedUser = result[0];
				// Extract all the fields *but* password as a new object (user)
				const { password, ...user } = insertedUser;
				// Get the host + port (localhost:3000) from the request headers
				const host = req.get('host');
				// Compute the full location, e.g. http://localhost:3000/api/users/132
				// This will help the client know where the new resource can be found!
				const location = `http://${host}${req.url}/${user.id}`;
				return res
				  .status(201)
				  .set('Location', location)
				  .json(user);
			})   
		})
}

router.post('/', checkUser, emailValidator, registerUserDb) 

module.exports = router