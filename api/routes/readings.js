const express = require('express');
// const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const Reading = require('../models/readingModel')
const NodeGeocoder = require('node-geocoder');


// get all points
router.get('/', checkAuth, (req,res,next) => { 
    Reading.find().
    limit(8).
    select('location city country distance measurements geoLoc').exec()
    .then(docs => {
        const response = {
            count:docs.length,
            reading:docs,
            request:{
                type:'GET',
                // url:'http://localhost:3000/products/'+
            }
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})

// get points by lat:lng
router.get('/:cityId', checkAuth, (req,res,next)=>{
    const id = req.params.cityId;
    Reading.findById(id).select('location city country distance measurements geoLoc').exec()
    .then( doc => {
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:'GET',
                    description:'Get all products',
                    url:'http://localhost:3000/products'
                }
            });
        }
        else{
            res.status(404).json({
                message:'no valid entry found'
            })
        }
        console.log(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        });
    });
})
module.exports = router;