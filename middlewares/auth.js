const express = require('express')
const jwt =  require('jsonwebtoken')
const bodyParser = require('body-parser')

module.exports = function Auth(req,res,next){
    try{
        console.log(req.body)
        const verify = jwt.verify(req.body.Token, process.env.SECERET_KEY)
        if(verify){
            next();
        }
    }
    catch(err){
        console.log(err)
        res.json({"error":err, "message":"jwt token error"})
    }
}