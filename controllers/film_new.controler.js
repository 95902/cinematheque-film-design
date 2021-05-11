const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const acteurModel = require("../models/acteur.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");

exports.liste_film_new_affichage = (requete,reponse)=>{ 
    var limit = 8;
        anneeModel.find()
        .populate("annees")
        .exec()
        .then(annee=>{
            
            filmModel.find( {annee: "608178f2dc46172c881b2721"}.limit(limit),)
            .populate("categorie")
            .exec()
            .then(films=>{
                
                categorieModel.find()
                .populate("films")
                .populate("annees")
                .exec()
                .then(categorie=>{
                    reponse.render("films/liste_films_new.html.twig",{
                        
                        liste : films, 
                        listecategorie:categorie,
                        listeannee:annee
                        
                    })
                    console.log(films[0].image)
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


exports.film_details = (requete,reponse)=>{
    filmModel.findById(requete.params.id)
        .populate("categorie")
        .populate("acteur")
        .exec()
        .then(film=>{
            categorieModel.findById(film.categorie._id)
            .populate("films")
            .exec()
            .then(categorie=>{
           

            reponse.render("films/film.html.twig",{film:film,
                categorie:categorie
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



// exports.film_details = (requete,reponse)=>{
//     filmModel.findById(requete.params.id)
//     .populate("categorie")
//     .populate("acteur")
//     .exec()
//     .then(film=>{
//         console.log(film.categorie._id)
//         categorieModel.findById(film.categorie._id)
//         .exec()
//         .then(categories=>{
            

//         reponse.render("films/film.html.twig",{film:film,categorie:categories,})
//         console.log(film.categorie)
//     })
//     .catch( error =>{
//         console.log(error)
//     });
// })
// .catch( error =>{
//     console.log(error)
// });
    
// }