const express = require('express');
const router = express.Router();
const Reading = require('../models/readingModel');

router.get('/',(req,res,next) => { 
    Reading.find().limit(8).select('location city country distance measurements geoLoc').exec()
    .then(docs => {
        var data =[];
        docs.map((val)=>{
            val.measurements.map((v) => {
                var para = v.parameter;
                if (para !== "pm25") {
                    
                } else {
                    
                }
            })
            
        })

        const response = {
            data:data
            // count:docs.length,
            // geoLoc:[],
            // data:{
            //     parameter:'',
            //     value:''
            // },
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