const mongoose = require("mongoose");
const acteurModel = require("../models/acteur.modele");
const fs = require("fs");

exports.acteur_pagination = async(requete, reponse)=>{
    
    acteurModel.find().skip(parseInt(requete.params.start)).limit(parseInt(requete.params.limit))
        .exec()
        .then(acteurs=>{
            reponse.send(acteurs);
        })
        .catch( error =>{
            console.log(error)
    });
  
}


exports.liste_acteurs_affichage= (requete,reponse)=>{
    var limit = 1;
    acteurModel.find().limit(limit)
        .exec()
        .then(acteur=>{
            console.log(acteur)
            reponse.render("acteurs/liste_acteurs.html.twig",{
                listeacteur:acteur,
            })
        })
        .catch( error =>{
            console.log(error)
    });
}

exports.acteur_affichage= (requete,reponse)=>{
    acteurModel.findById(requete.params.id)
    .populate("films")
    .exec()
    .then(acteur=>{
        console.log(acteur);
        reponse.render("acteurs/acteur.html.twig",{acteur:acteur,isModification:false})
    })
    .catch( error =>{
        console.log(error)
    });
}


