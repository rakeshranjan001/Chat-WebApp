const express = require('express');
const knex = require('knex');
const login = express.Router();
const bcrypt = require('bcrypt-nodejs');
const db =  knex({
    client :'pg',
    connection:{connectionString: process.env.DATABASE_URL,
    ssl:true,
    }
});

login.post('/',(req,res)=>{
   db.select('email','hash').from('account').where('email','=',req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
            if(isValid){
                return db.select('*').from('account').where('email','=',req.body.email)
                    .then((user) => {
                        res.status(200).json(user[0])
                    })
                    .catch((err) => res.status(403).json('Unable to get user'))
            }
            else{
                res.status(401).json('Wrong Credentials')
            }
        })
        .catch((err) => res.status(401).json('Wrong Credentials'))
})



login.get('/profile/:id',(req,res)=>{
    const{id} =req.params;
    let found = false;
    db.select('*').from('users').where({id}) // .where({ id : id })
    .then(user =>{
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json("Not Found")
        }
    })
    .catch(err=>res.status(400).json('Not Found'))

})

module.exports = login;