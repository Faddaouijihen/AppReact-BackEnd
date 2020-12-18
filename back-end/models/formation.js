const mongoose = require('mongoose');

const schema = mongoose.Schema;

const formationschema = new schema ({
    title:{type: String,required:true},
    description:{type: String,required:true},
  
    condidats:[{type:mongoose.Types.ObjectId,required:true,ref:'condidat'}],
    
})

module.exports = mongoose.model('formation',formationschema);