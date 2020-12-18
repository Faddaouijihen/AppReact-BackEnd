const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema;

const condidatschema = new schema ({
    name:{type: String,required:true},
    email:{type: String,required:true},
    password:{type: String,required:true},
    condidatures:[{type: mongoose.Types.ObjectId,required:true,ref:'formation'}]
})

condidatschema.plugin(uniqueValidator)

module.exports = mongoose.model('condidat',condidatschema);