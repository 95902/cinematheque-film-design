const mongoose = require("mongoose");
const evenementModel = require("../models/evenement.model");
const acteurModel = require("../models/acteur.modele");
const filmModel = require("../models/films.modele");
const fs = require("fs");


exports.admin_evenement_affichage=(requete,reponse)=>{
    evenementModel.find()
    .exec()
    .then(evenements =>{
        acteurModel.find()
        .exec()
        .then(acteur =>{

            reponse.render("admin/ajout_evenement.html.twig",{
                liste : evenements,
                listeActeur:acteur,
               });
        })
            .catch( error =>{
                console.log(error)
            });

         })
    
    
}

exports.admin_evenement_modification = (requete,reponse)=>{
    evenementModel.find()
        .exec()
           .then(evenement=>{
                        reponse.render("admin/detail_evenement.html.twig",{
                            evenement:evenement, 
                            isModification:true
                        });
                    })
                .catch( error =>{
                    console.log(error)
                });
}



 exports.admin_evenement_modification_bdd = (requete,reponse)=>{
    const evenementUpdate ={
        titre: requete.body.titre,
        description :requete.body.description,
        lieu : requete.body.lieu,
        dateDeb: requete.body.dateDeb,
        dateFin: requete.body.dateFin,
    }
    evenementModel.updateOne({_id:requete.body.identifiant},evenementUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified < 1) throw new Error("Requete de modification échouée");
        requete.session.message = {
            type : 'success',
            contenu : 'modification effectuée'
        }
        reponse.redirect("/admin_evenement");
    }) 
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type : 'danger',
            contenu : error.message
        }
        reponse.redirect("/admin_evenement");
    })
}


exports.admin_evenement_update_image = (requete,reponse)=>{ 
    var evenement = filmModel.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(film => {
        fs.unlink("./public/images/"+film.image, error => {
            console.log(error);
        })
        const evenementUpdate = {
            image : requete.file.path.substring(14)
        }
        evenementModel.updateOne({_id:requete.body.identifiant}, evenementUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/admin_evenement/modification/"+requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
    });
} 

exports.admin_evenement_ajout =(requete,reponse)=>{ 
    const evenement = new evenementModel({
        _id: new mongoose.Types.ObjectId(),
        titre: requete.body.titre,
        description :requete.body.description,
        dateDeb : requete.body.dateDeb,
        dateFin : requete.body.dateFin,
        lieu : requete.body.lieu,
        image:requete.file.path.substring(14),
        acteur:requete.body.acteur
    });
    evenement.save()
    .then(resultat => {
        reponse.redirect("/admin_evenement");
    })
    .catch(error => {
        console.log(error);
    })
}


 exports.admin_evenement_delet = (requete,reponse)=>{
    var evenement= evenementModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(evenement => {
        fs.unlink("./public/images/"+evenement.image, error => {
            console.log(error);
        })
        evenementModel.remove({_id:requete.params.id})
        .exec()
        .then(resultat => {
            requete.session.message = {
                type : 'success',
                contenu : 'Suppression effectuée'
            }
            reponse.redirect("/admin_evenement");
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })    
}  