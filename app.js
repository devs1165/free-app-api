const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Readings = require('./api/models/readingModel')
const BestWorstDb = require('./api/models/bestWorstModel')
const request = require('request');

const readingRouter = require('./api/routes/readings');
const citiesRouter = require('./api/routes/cities');
const mapRouter = require('./api/routes/mapsdata');
const bestworstRouter = require('./api/routes/bestworst');
const userRouter = require('./api/routes/user');
// const facebookRouter = require('./api/routes/auth/facebook');


// mongo cloud production  connection
    // connection string for v3.4
var uri = 'mongodb://ambeedev:Ambee90526@app-openaq-data-cluster-shard-00-00-jwqfm.mongodb.net:27017,app-openaq-data-cluster-shard-00-01-jwqfm.mongodb.net:27017,app-openaq-data-cluster-shard-00-02-jwqfm.mongodb.net:27017/test?ssl=true&replicaSet=app-openaq-data-cluster-shard-0&authSource=admin&retryWrites=true';
    // connection string for v3.6 and later
var uri1 = 'mongodb+srv://ambeedev:Ambee90526@app-openaq-data-cluster-jwqfm.mongodb.net/ambee-ap-app?retryWrites=true'
mongoose.connect(uri1,{useNewUrlParser:true})
    
// m-lab mongo connection
// mongoose.connect('mongodb://ambeedev:ambeedev1@ds035683.mlab.com:35683/heroku_j72zc3t2',{ useNewUrlParser : true });

// localhost mongo connection
// mongoose.connect('mongodb://127.0.0.1:27017/dev-openaqs-test',{ useNewUrlParser: true } )

// use bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors handling
app.use((req, res, next) => {
    // * can be replaced by any http://somthing.com
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );  
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')    
        return res.status(200).json({});
    }
    next();
});

app.get('/',(req,res,next) => {
    res.status(200).json({
        message:"server is running to fetch latest data do nothing",
        sub:"this is just a test message to check server is running or not",
        credit:"powered by -Ambee"
    })
})



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
                },
                timestamp:Date.now()
            };
            saveBestWorstData(obj);
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
function saveBestWorstData(v){
    v.measurements.map((val,ind)=>{
        var object;
        if(val.parameter === 'pm25' && v!==undefined){
             object = {
                location: v.location,
                city: v.city,
                country: v.country,
                pm25:val.value,
                timestamp:Date.now()
            }
            var best =new BestWorstDb(object)
            best.save()
            .then(r=>{
                console.log("best worst data saved to db");    
            }).catch(err =>{
                console.log("got an error");    
            })    
        }    
    })
}

app.use('/reading', readingRouter);
app.use('/cities', citiesRouter);
app.use('/map', mapRouter);
app.use('/bestworst', bestworstRouter);
app.use('/user', userRouter);


module.exports = app;
