const mongoose= require("mongoose");

const categorieSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    libelle: String,
})


categorieSchema.virtual("films", {
    ref : "Film",
    localField : "_id",
    foreignField: "categorie",
})

module.exports = mongoose.model("Categorie",categorieSchema);
