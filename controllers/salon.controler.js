const mongoose = require("mongoose");

const fs = require("fs");



exports.salon_affichage= (requete,reponse)=>{

        reponse.render("chaat_rooms/chat.html.twig")
}




exports.liste_salon_affichage= (requete,reponse)=>{

    reponse.render("chaat_rooms/liste_chat.html.twig")
}
