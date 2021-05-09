const mongoose= require("mongoose");

const anneSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    annee: Number,
})


anneSchema.virtual("films", {
    ref : "Film",
    localField : "_id",
    foreignField: "annee",
})

module.exports = mongoose.model("Annee",anneSchema);