const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

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
router.post('/',(req,res,next) => {
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
            return res.status(200).json({
                message:'auth successful',
                token:token
            })
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
                        expiresIn: '1h'
                    }
                );
                res.status(201).json({
                    message:'auth successful created and token generated',
                    token:token
                })
            })
            .catch(err => {
                res.status(500).json({
                    error:err
                })
            });
        }
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
