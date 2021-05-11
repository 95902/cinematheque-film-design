const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const acteurModel = require("../models/acteur.modele");
const categorieModel = require("../models/categories.modele");
const anneeModel = require("../models/annee.model");
const userModel = require("../models/user.model");
const alert = require('express-flash-message');

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
                    // console.log(categorie)
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
                    // console.log(categorie)
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

var idfilm;
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
            // console.log(film)
                //increment view

                const viewUpdate ={
                    $inc:{"view":1}
                 
                };
                idfilm=requete.params.id;
                console.log(idfilm)
                filmModel.updateOne({_id:requete.params.id},viewUpdate)
                .exec()
                .then(resultat => {
                   
                // console.log(resultat);
                // console.log(film);
                reponse.render("films/film.html.twig",{film:film,
                    categorie:categorie
                })
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

exports.doLike = (requete,reponse)=>{

     if (requete.user){
         var film;
            console.log(requete.user)
            console.log(requete.user._id)
            filmModel.findOne({"_id":idfilm,"likers._id":requete.user._id})
                .exec()
                .then(film => {
                console.log(film)
                    if(film == null ){
                        // envoie base bdd
                        const likers = {$push:{"likers":{_id:requete.user._id}}}
                        filmModel.updateOne({_id:idfilm},likers)
                        .exec()
                        .then(resultat => {
                                        
                        })
                    
                        reponse.json({
                            "status":"error",
                            "message":"Vous likez cette video "
                        });
                    }else{
                        reponse.json({
                            "status":"error",
                            "message":"Vous avez déjà liker cette video "
                        }) 
                    }
            })
    }else{
        reponse.json({
            "status":"error",
            "message":"Connectez-vous "
        });       
        
    }



}
exports.dislikes = (requete,reponse)=>{

    if (requete.user){
        var film;
           console.log(requete.user)
           console.log(requete.user._id)
           filmModel.findOne({"_id":idfilm,"dislikers._id":requete.user._id})
               .exec()
               .then(film => {
               console.log(film)
                   if(film == null ){
                       // envoie base bdd
                       const dislikers = {$push:{"dislikers":{_id:requete.user._id}}}
                       filmModel.updateOne({_id:idfilm},dislikers)
                       .exec()
                       .then(resultat => {
                                       
                       })
                   
                       reponse.json({
                           "status":"error",
                           "message":"Vous n'avez pas aimer cette video "
                       });
                   }else{
                       reponse.json({
                           "status":"error",
                           "message":"Vous avez déjà voter sur cette video "
                       }) 
                   }
           })
   }else{
       reponse.json({
           "status":"error",
           "message":"Connectez-vous "
       });       
       
   }



}
        //check

    //     filmModel.findById(idfilm)

    //     },function(error,film){
    //         if (film == null){
    //             // envoye le like en bdd
            
    //             console.log(film)
    //             const likers = {
    //                 likers:{_id:requete.user._id}
    //             }
    //             console.log(likers)
    //                 filmModel.updateOne({_id:idfilmd},likers)
    //                 .exec()
    //                 .then(resultat => {
    //                     console.log(resultat)
    //                 })
               

    //             ,function(error,data){
    //                 reponse.json({
    //                     "status":"success",
    //                     "message":"le film à été liker "
    //                 });  
    //             }
    //         }else{
    //             reponse.json({
    //                 "status":"error",
    //                 "message":"alaready like this movies"
    //             })

    //         }
    //     })

    // }else{
    //     reponse.json({
    //         "status":"error",
    //         "message":"Connectez vous "
    //     })
//     }



// }

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