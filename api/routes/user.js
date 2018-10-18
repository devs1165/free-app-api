const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Tokens = require('../models/tokenModel');

// get all users from db
router.get('/',(req,res,next)=>{
    User.find()
    .exec()
    .then(result=>{
        res.status(201).json({
            message:'User created',
            result: result
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    });
})


// create and login user with generating token
router.post('/login',(req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1){
            // generate token only
            const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                    'secret', 
                { 
                    expiresIn: '1h'
                }
            );
            var toks = new Tokens({
                userId:user[0]._id,
                tokens:token
            })
            toks.save().then(tok => {
                res.status(200).json({
                    message:'auth successful',
                    token:tok
                })
            })
            .catch(err => {
                res.status(500).json({
                    error:err
                })
            });
        }
        else{
            // create user and generate token 
            const user = new User({
                source:req.body.source,
                name:req.body.name,
                email:req.body.email,
                userpic:req.body.userpic
            })
            user.save()
            .then(result=>{
                const token = jwt.sign(
                    {
                        email: result.email,
                        userId: result._id
                    }, 
                        'secret', 
                    { 
                        expiresIn:'1h'
                    }
                );
                var toks = new Tokens({
                    userId:result._id,
                    tokens:token
                })

                toks.save().then(tok => {
                    res.status(201).json({
                        message:'auth successful created and token generated',
                        token:tok
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error:err
                    })
                });



            })
            .catch(err => {
                res.status(500).json({
                    error:err
                })
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    });
})


// saving token to db 
router.post('/refreshToken',(req,res,next) => {
    const oldtoken = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(oldtoken, 'secret');
    console.log(decode);
    const token = jwt.sign(
        {
            email: decode.email,
            userId: decode.userId
        }, 
            'secret', 
        { 
            expiresIn: '1h'
        }
    );
    // req.userData = decode;

    Tokens.update({userId:decode.userId},{$set:{"tokens":token}})
    // .exec()
    .then(resul =>{
        res.status(200).json({
            message:'token refreshed ok',
            token:token
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })

})


// delete user from  db
router.delete('/:userId', (req,res, next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then(result => {
        res.status(201).json({
            message:'user deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err 
        })
    })
})


module.exports = router;
