const express = require ('express')
const { connection } =require('../helper/conf')

const router = express.Router() 

//Get list of contract of an user
router.get('/', (req,res) => {
    const sql = `
    SELECT title, description, icon_url 
    FROM contract 
    JOIN contract_user 
    ON contract.id = contract_user.contract_id
    JOIN user
    ON user.id = contract_user.user_id`
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error to get the list of contracts')
        } else {
            res.send(result)
        }
    })
})

module.exports = router
