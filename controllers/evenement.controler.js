const mongoose = require("mongoose");
const evenementModel = require("../models/evenement.model");
const acteurModel = require("../models/acteur.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");



exports.liste_evenement_affichage = async (requete,reponse)=>{ 
    anneeModel.find()
    .exec()
    .then(annee=>{
        categorieModel.find()
        .populate("films")
        .exec()
        .then(categorie=>{
            evenementModel.find()
            .exec()
            .then(evenements=>{
                reponse.render("evenements/liste_evenement.html.twig",{
                        liste : evenements,
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
        });
    })
    .catch( error =>{
        console.log(error)
    });
            
}



exports.evenement_details = (requete,reponse)=>{
    evenementModel.findById(requete.params.id)
        .populate("acteur")
        .exec()
        .then(evenement=>{
            acteurModel.findById(evenement.acteur._id)
            .exec()
            .then(acteur=>{
                console.log(evenement)
                
                reponse.render("evenements/evenement.html.twig",{evenement:evenement,
                    acteur:acteur
                 })

            })
            .catch( error =>{
                console.log(error)
            });  
        })
    .catch( error =>{
        console.log(error)
    });  
}
