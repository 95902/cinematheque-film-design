const mongoose = require('mongoose');

const evenementSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    titre: String,
    description : String,
    lieu : String,
    dateDeb : String,
    dateFin : String,
    image:String,
    acteur:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Acteur",
        require:true
    }],
    
})

module.exports = mongoose.model("Evenement",evenementSchema);

