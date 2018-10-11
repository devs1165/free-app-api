const express = require('express');
const router = express.Router();
const Reading = require('../models/readingModel');

router.get('/',(req,res,next) => { 
    var lat = req.query.lat,
        lng = req.query.lng,
        radius = req.query.radius; 
    Reading.find( { geoLoc: { $geoWithin: { $center: [ [lat, lng], radius ] } } })
    // .limit(8)
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