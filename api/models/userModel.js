const mongoose = require('mongoose');
// const socialLoginSchema = mongoose.Schema({
//     source:{ 
//         type:String, 
//         required:true
//     },
//     name:{
//         type:String,
//         required:true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
//     },
//     token:{
//         required:true
//     }
// })
// module.exports = mongoose.model('User',socialLoginSchema);


const userSchema = mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    source:{ 
        type:String, 
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    userpic:{
        type:String
    }
    // token:{
    //     type:String,
    //     required:true
    // }
    // password: {type: String, required: true}
})
module.exports = mongoose.model('User',userSchema);

