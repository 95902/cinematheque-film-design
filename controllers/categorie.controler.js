const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");
const fs = require("fs");

exports.categorie_affichages=(requete,response)=>{
    categorieModel.findById(requete.params.id)
    .populate("films")
    .exec()
    .then(categorie=>{
        categorieModel.find()
        .exec()
        .then(categories=>{
            anneeModel.find()
            .exec()
            .then(annee=>{
                console.log(categorie);
                response.render("categories/categories.html.twig",{categorie:categorie, listecategories:categories ,listeannee:annee })
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


exports.liste_categories_affichage = (requete,reponse)=>{
    categorieModel.find()
    .populate("films")
    .exec()
    .then(categories=>{
        reponse.render("categories/liste_categories.html.twig",{ listeCategorie:categories,});
    })
    .catch( error =>{
        console.log(error)
    });
}