const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Readings = require('./api/models/readingModel')
const request = require('request');

const readingRouter = require('./api/routes/readings');
const citiesRouter = require('./api/routes/cities');
const mapRouter = require('./api/routes/mapsdata');
const bestworstRouter = require('./api/routes/bestworst');
const userRouter = require('./api/routes/user');



// mongoose.connect('mongodb://ambeedev:ambeedev1@ds035683.mlab.com:35683/heroku_j72zc3t2');
mongoose.connect('mongodb://127.0.0.1:27017/dev-openaqs-test',{ useNewUrlParser: true } )

// use bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get("/abc",function(req,res,next){
    // openAq Data api
    var postOpenAqDataToDb = request('https://api.openaq.org/v1/latest?limit=8620',(err,resp,body)=>{
        var d = JSON.parse(body).results;
         
        d.map(function(v,i) {
            var coords;
            if(v.coordinates!==undefined){
                coords = [v.coordinates.latitude,v.coordinates.longitude]
            }
            var obj = {
                location: v.location,
                city: v.city,
                country: v.country,
                distance: v.distance,
                measurements:v.measurements,
                geoLoc:{
                    type: 'Point',
                    coordinates: coords
                }
            };
            
            var reading = new Readings(obj)
            reading.save()
            .then(result => {
                if(i == d.length - 1)
                    res.status(200).send({
                        message:' data sucessfully saved to Db'
                    })
            })
            .catch(err => {
                if(i == d.length - 1)
                    res.status(500).send({
                        message:'an error occured while saving data to db',
                        error:err
                    })
            })
        })
    })

})


app.use('/reading', readingRouter);
app.use('/cities', citiesRouter);
app.use('/map', mapRouter);
app.use('/bestworst', bestworstRouter);
app.use('/user', bestworstRouter);




module.exports = app;
