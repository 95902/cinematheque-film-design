const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const acteurModel = require("../models/acteur.modele");
const fs = require("fs");
const categoriesModele = require("../models/categories.modele");
const anneesModele = require("../models/annee.model");

exports.admin_film_affichage=(requete,reponse)=>{
    anneesModele.find()
    .exec()
    .then(annees=>{
        categoriesModele.find()
        .exec()
        .then(categories=>{
            acteurModel.find()
            .exec()
            .then(acteurs =>{
                filmModel.find()
                    .populate("acteur")
                    .populate("categorie")
                    .populate("annee")
                    .exec()
                    .then( films=>{
                        reponse.render("admin/ajout_film.html.twig",{
                            liste : films,
                            listeActeur:acteurs,
                            listeCategorie:categories,
                            listeAnnee:annees,
                            message:reponse.locals.message});
                            console.log(films)
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
    })
    .catch( error =>{
        console.log(error)
    });
}


exports.admin_film_detail=(requete,reponse)=>{
    filmModel.findById(requete.params.id)
    .populate("categorie")
    .populate("acteur")
    .exec()
    .then(film=>{
        reponse.render("admin/detail_film.html.twig",{film:film,isModification:false})
    })
    .catch( error =>{
        console.log(error)
    });
}

exports.admin_film_modification = (requete,reponse)=>{
    anneesModele.find()
        .exec()
            .then(annees=>{
        categoriesModele.find()
        .exec()
            .then(categories=>{
            acteurModel.find()
            .exec()
            .then(acteurs =>{
                filmModel.findById(requete.params.id)
                .populate("categorie")
                .populate("acteur")
                    .exec()
                    .then(film=>{
                        reponse.render("admin/detail_film.html.twig",{
                            film:film, 
                            listeActeur:acteurs, 
                            listeCategorie:categories,
                            listeAnnee:annees,
                            isModification:true
                        });
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
    })
    .catch( error =>{
        console.log(error)
    });
}

exports.admin_film_modification_bdd = (requete,reponse)=>{
    const filmUpdate ={
        titre: requete.body.titre,
        synopsys :requete.body.synopsys,
        annee : requete.body.annee,
        categorie : requete.body.categorie,
        acteur:requete.body.acteur,
        Bdannonce:requete.body.Bdannonce,
        duree:requete.body.duree,
        Realisateur:requete.body.Realisateur,
        Pays:requete.body.Pays
    }
    filmModel.updateOne({_id:requete.body.identifiant},filmUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified < 1) throw new Error("Requete de modification échouée");
        requete.session.message = {
            type : 'success',
            contenu : 'modification effectuée'
        }
        reponse.redirect("/admin_film");
    }) 
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type : 'danger',
            contenu : error.message
        }
        reponse.redirect("/admin_film");
    })
}


exports.admin_film_update_image = (requete,reponse)=>{ 
    var film = filmModel.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(film => {
        fs.unlink("./public/images/"+film.image, error => {
            console.log(error);
        })
        const filmUpdate = {
            image : requete.file.path.substring(14)
        }
        filmModel.updateOne({_id:requete.body.identifiant}, filmUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/admin_film/modification/"+requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
    });
}

exports.admin_film_ajout =(requete,reponse)=>{ 
    const film = new filmModel({
        _id: new mongoose.Types.ObjectId(),
        titre: requete.body.titre,
        synopsys :requete.body.synopsys,
        annee : requete.body.annee,
        acteur : requete.body.acteur,
        categorie : requete.body.categorie,
        Bdannonce:requete.body.Bdannonce,
        duree:requete.body.duree,
        Realisateur:requete.body.Realisateur,
        Pays:requete.body.Pays,
        image:requete.file.path.substring(14)
    });
    film.save()
    .then(resultat => {
        reponse.redirect("/admin_film");
    })
    .catch(error => {
        console.log(error);
    })
}


exports.admin_film_delet = (requete,reponse)=>{
    var film = filmModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(film => {
        fs.unlink("./public/images/"+film.image, error => {
            console.log(error);
        })
        filmModel.remove({_id:requete.params.id})
        .exec()
        .then(resultat => {
            requete.session.message = {
                type : 'success',
                contenu : 'Suppression effectuée'
            }
            reponse.redirect("/admin_film");
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })    
}