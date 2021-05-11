const mongoose = require("mongoose");
const acteurModel = require("../models/acteur.modele");
const fs = require("fs");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");

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
    var limit = 8;
    anneeModel.find()
    .exec()
    .then(annee=>{
        categorieModel.find()
        .populate("films")
        .exec()
        .then(categorie=>{
            acteurModel.find().limit(limit)
                .exec()
                .then(acteur=>{
                    // console.log(acteur)
                    reponse.render("acteurs/liste_acteurs.html.twig",{
                        listeacteur:acteur,
                        listecategorie:categorie,
                        listeannee:annee
                    })
                })
            .catch( error =>{
                console.log(error)
            });
        })
        .catch( error =>{
            console.log(error)
    })
    })
    .catch( error =>{
        console.log(error)
    })
}

exports.acteur_affichage= (requete,reponse)=>{
    acteurModel.findById(requete.params.id)
    .populate("films")
    .exec()
    .then(acteur=>{
        // console.log(acteur);
        reponse.render("acteurs/acteur.html.twig",{acteur:acteur,isModification:false})
    })
    .catch( error =>{
        console.log(error)
    });
}


