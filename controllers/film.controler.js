const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const acteurModel = require("../models/acteur.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");

exports.film_pagination = async(requete, reponse)=>{
    
    filmModel.find().skip(parseInt(requete.params.start)).limit(parseInt(requete.params.limit))
    .populate("categorie")
        .exec()
        .then(films=>{
            console.log(films);
            reponse.send(films);
        })
        .catch( error =>{
            console.log(error)
        });
  
}


exports.liste_film_affichage = async (requete,reponse)=>{ 
    var limit = 8;
    function escapeRegex(text) {
        return text.replace(/[\[\]?*+|{}\\()@.\n\r]/);
    };
    if(requete.query.search){
        const regex = new RegExp(escapeRegex(requete.query.search), 'gi');

        filmModel.find({
          titre: regex
        }).exec()
        .then(films=>{

            anneeModel.find()
            .exec()
            .then(annee=>{
                categorieModel.find()
                .populate("films")
                .exec()
                .then(categorie=>{
                    console.log(categorie)
                    reponse.render("films/liste_films.html.twig",{
                        liste : films, 
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

        if(films.length < 1) {
            noMatch = "Desolé aucun film ne corresponds";
        }
            reponse.render("films/liste_films.html.twig",{liste:films, noMatch: noMatch}); 
        })


    }else{
        filmModel.find().limit(limit)
        .populate("categorie")
        .exec()
        .then(films=>{
            anneeModel.find()
            .exec()
            .then(annee=>{
                categorieModel.find()
                .populate("films")
                .exec()
                .then(categorie=>{
                    console.log(categorie)
                    reponse.render("films/liste_films.html.twig",{
                        liste : films, 
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
            console.log(film)

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