const mongoose = require("mongoose");
const salonModel = require("../models/salon.modele");
const fs = require("fs");



exports.salon_affichage= (requete,reponse)=>{
    
        reponse.render("chaat_rooms/chat.html.twig")
}




exports.liste_salon_affichage = (requete,reponse)=>{
    salonModel.find()
    .exec()
    .then( salon=>{
        reponse.render("chaat_rooms/liste_chat.html.twig",{
            liste : salon
        });

    })
    .catch( error =>{
        console.log(error)
    });     
}
