const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
    location: {
        type:String
    },
    city: {
        type:String
    },
    country: {
        type:String
    },
    distance: {
        type:Number
    },
    measurements:[],

    geoLoc: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        }
    }
})

module.exports = mongoose.model('Reading',readingSchema);
   