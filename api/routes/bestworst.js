const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
// const Reading = require('../models/readingModel');
const BestWorstDb = require('../models/bestWorstModel')

router.get('/best', checkAuth, (req,res,next) => {
    BestWorstDb.find()
    .sort({pm25:+1, timestamp : -1})
    .limit(10)
    .select('location city country pm25 timestamp')
    .exec()
    .then(docs => {
        res.status(200).json({
            message:'top 10 best cities',
            data:docs
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err            
        })
    })
})


router.get('/worst', checkAuth, (req,res,next) => {
    BestWorstDb.find()
    .sort({pm25:-1, timestamp: -1})
    .limit(10)
    .select('location city country pm25 timestamp')
    .exec()
    .then(docs => {
        res.status(200).json({
            message:'top 10 worst cities',
            data:docs
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err            
        })
    })    
})

module.exports = router;
