const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'Reading', required: true },
    quantity: { type: Number, default: 1 }
})

module.exports = mongoose.model('City',citySchema);