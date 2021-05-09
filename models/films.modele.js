const mongoose= require("mongoose");

const filmSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    titre: String,
    synopsys : String,
    annee : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Annee",
        require:true
    },
    acteur:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Acteur",
        require:true
    }],
    categorie:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Categorie",
        require:true
    },
    image:String,
    Bdannonce:String,
})

module.exports = mongoose.model("Film",filmSchema);


