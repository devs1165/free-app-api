const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Reading = require('../models/readingModel');

router.get('/', checkAuth, (req,res,next) => { 
    var lat = req.query.lat,
        lng = req.query.lng,
        radius = req.query.radius,
        limit = req.query.limit ; 


    Reading.find( { geoLoc: { $geoWithin: { $center: [ [lat, lng], radius ] } } })
    .limit(parseInt(limit))
    .select('location city country distance measurements geoLoc')
    .exec()
    .then(docs => {
        // console.log(docs)
        const response = {
            message:'map data fetched',
            count:docs.length,
            data:docs,
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;