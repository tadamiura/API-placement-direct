const express = require ('express')
const { connection } =require('../helper/conf')
const { verifyToken } = require('../helper/auth.service')

const router = express.Router() 



/*
USER'S INFORMATIONS
*/
//Read a user's information with auth
router.get('/:id', verifyToken, (req,res) => {
    const idUser = req.params.id
    const sql = 
    `SELECT name, lastname, email, telephone_number 
    FROM user
    WHERE id = ?`
    connection.query(sql, [idUser], (err, result) => {
        if (err) {
            res.status(500).send('Error to get the user information')
        } else {
            res.status(200).send(result[0])
        }
    })
})

//Update a user's information with auth
router.put('/:id', verifyToken, (req,res) => {
    const formData = req.body
    const idUser = req.params.id
    const sql = 
    `UPDATE user
    SET ?
    WHERE id = ?`
    connection.query(sql, [formData, idUser], (err, result) => {
        if (err) {
            res.status(500).send(`Error to update user profile : ${err}`)
        } else {
            res.sendStatus(200)
        }
    })
})

/*
CONTRACT'S OF USER
*/ 
//Get the list of contract(s) of an user
router.get('/:id/contract', verifyToken, (req,res) => {
    const idUser = req.params.id
    const sql = 
    `SELECT title, description, icon_url 
    FROM contract 
    JOIN contract_user 
    ON contract.id = contract_user.contract_id
    JOIN user
    ON user.id = contract_user.user_id
    WHERE user.id = ?
    ORDER BY title ASC`
    connection.query(sql, [idUser], (err, result) => {
        if (err) {
            res.status(500).send(`Error : ${err}`)
        } else {
            res.status(200).send(result)
        }
    })
})

module.exports = router
