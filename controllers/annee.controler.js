const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");
const fs = require("fs");

exports.annees_affichages=(requete,response)=>{
    anneeModel.findById(requete.params.id)
    .populate("films")
    .exec()
    .then(annee=>{
        anneeModel.find()
        .exec()
        .then(annees=>{
        console.log(annee);
            categorieModel.find()
            .exec()
            .then(categories=>{
                response.render("annees/annee.html.twig",{annee:annee, listeAnnees:annees ,listecategories:categories })
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


exports.liste_annees_affichage = (requete,reponse)=>{
    anneeModel.find()
    .populate("films")
    .exec()
    .then(annees=>{
        reponse.render("annees/liste_annees.html.twig",{ listeAnnees:annees,});
    })
    .catch( error =>{
        console.log(error)
    });
}