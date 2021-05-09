const mongoose= require("mongoose");

const acteurSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom: String,
    prenom : String,
    titre : String,
    date_naissance:Date,
    nationalite : String,
    biographie : String,
    oscar:Boolean,
    cesar:Boolean,
    golden :Boolean,
    image:String,
})


acteurSchema.virtual("films", {
    ref : "Film",
    localField : "_id",
    foreignField: "acteur",
})

acteurSchema.virtual("evenements", {
    ref : "Evenement",
    localField : "_id",
    foreignField: "acteur",
})

module.exports = mongoose.model("Acteur",acteurSchema);
