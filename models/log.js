const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = mongoose.Schema({
     _id: Schema.Types.ObjectId,
    event: String,
    time: Date
});


const Log = module.exports = mongoose.model('Log', logSchema);
