const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema;

const userschema = new schema ({
    name:{type: String,required:true},
    email:{type: String,required:true,unique:true},
    password:{type: String,required:true,minlength:8},
    
})

userschema.plugin(uniqueValidator)

module.exports = mongoose.model('user',userschema);