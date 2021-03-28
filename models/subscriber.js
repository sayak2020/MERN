const mongoose = require('mongoose');
const moment = require('moment');
const subscriberSchema = new mongoose.Schema({
    //_id:{
    //    type: Number,
    //    required: true
    //},
    name: {
        type: String,
        required: true
    },
    subscriberToChannel: {
        type: String,
        required: true
    },
    subscribeDate: {
        type: String,
        required: true,
        default: Date("<dd/mm/yyyy>")
       // moment(Date).format('DD-MM-YYYY') 
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);