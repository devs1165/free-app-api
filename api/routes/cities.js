const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const City = require('../models/citiesModel');
const Reading = require('../models/readingModel');


router.get('/', (req,res,next) => {
    City.find({user:req.query.userId})
    .select('city')
    // for getting all detail from another collection use populate
    // use field name to get the selcted field
    .populate('city')
    .exec()
    .then(docs => {
        res.status(200).json({
            message:'Cities were fetched',
            count:docs.length,
            cities:docs.map(doc => {    
                return{
                    id:doc._id,
                    location:doc.city,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/reading/' + doc.city._id
                    }
                }
            }),
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'error occured',
            error:err
        })
    })
})

// add city
router.post('/', checkAuth, (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, 'secret');
    var getCities = checkCities(decode.userId, req.body.cityId);
    getCities.then(checkResult=> {
        if(checkResult.length < 1){
            // fetch reading to check city validation
            Reading.findById(req.body.cityId)
            .then(resCity => {
                // check if city is availiable
                if (!resCity) {
                    return res.status(404).json({
                        message:'This is not a valid city'
                    })  
                } 
                // create order
                const newCity = new City({
                    user:req.body.userId,
                    quantity:1,
                    city:req.body.cityId,
                })
                return newCity.save()
            })
            .then(result => {
                res.status(201).json({
                    message:'city added to your profile',
                    order:result,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/reading/'+result.city
                        
                    }
                })
            })  
            .catch(err => {
                res.status(500).json({
                    message:"city not found",
                    error:err
                })
            })
            
        }
        else{
            res.status(409).json({
                message:'city already added please choose another city'
            })    
            
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"city not found",
            error:err
        })
    })
    
})

// check cities in db by userId
function checkCities(userId,cityId){
    return City.find({user:userId,city:cityId}).then(result =>{
        var arr = [];
        result.map((v,i)=>{
            arr.push(v.city)
        })
        return arr;
    }).catch(err =>{
        return err
    })
}





// delete city byId
router.delete('/:newCityId', checkAuth, (req,res,next) => {
    // const token = req.headers.authorization.split(" ")[1];
    // const decode = jwt.verify(token, 'secret');
    City.remove({_id:req.params.newCityId}).exec()
    .then(result => {
        res.status(200).json({
            message:'City deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/cities',
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'delete failed',
            error:err
        })
    })
})



module.exports = router;
