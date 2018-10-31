const mongoose = require('mongoose');

const bestworstSchema = mongoose.Schema({
    location: {
        type:String
    },
    city: {
        type:String
    },
    country: {
        type:String
    },
    pm25:{
        type:Number        
    },
    timestamp:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('Bestworst',bestworstSchema);
   