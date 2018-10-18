const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
    userId:{ 
        type:String, 
        required:true
    },
    tokens:{
        type:String, 
        required:true
    }
})
module.exports = mongoose.model('Token',tokenSchema);
