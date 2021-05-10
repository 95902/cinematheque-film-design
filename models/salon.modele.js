const mongoose= require("mongoose");

const salonSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom: String,
    description : String,
    image:String,
})

module.exports = mongoose.model("Salon",salonSchema);
