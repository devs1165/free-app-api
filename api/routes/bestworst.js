const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Reading = require('../models/readingModel');

router.get('/best', (req,res,next) => {
    Reading
    // .find()
    .aggregate(
        [
          { $match: { 'measurements.parameter' : "pm25" } },
          { $sort: { 'measurements.value' : -1 } }
        ]
    )
    // .sort({'measurements.value':-1}) // -1 for MAX 
    // .sort({'measurements.value':+1}) // +1 for MIN
    .limit(10)
    // .select('location city country distance measurements geoLoc')
    .exec()
    .then(docs => {
        // docs.map((val) => {
        //     val.map((v)=>{
        //     })
        //     // console.log(val.measurements)
        // })
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
router.get('/worst', (req,res,next) => {
    
})
module.exports = router;
