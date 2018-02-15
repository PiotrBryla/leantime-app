const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departamentSchema = mongoose.Schema({
     _id: Schema.Types.ObjectId,
    name: String
});

const Department = module.exports = mongoose.model('Departament', departamentSchema);
