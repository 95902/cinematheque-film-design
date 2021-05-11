const mongoose = require("mongoose");
const filmModel = require("../models/films.modele");
const acteurModel = require("../models/acteur.modele");
const fs = require("fs");

exports.liste_acteurs_affichage = (requete,reponse)=>{
    acteurModel.find()
        .populate("films")
        .exec()
        .then(acteurs=>{
            reponse.render("admin/liste_acteurs.html.twig",{ listeActeur:acteurs,});
        })
    .catch( error =>{
        console.log(error)
    });
}

exports.acteur_ajout=(requete,reponse)=>{
    const acteur = new acteurModel({
        _id : new mongoose.Types.ObjectId,
        nom: requete.body.nom,
        prenom : requete.body.prenom,
        date_naissance:requete.body.date_naissance,
        nationalite :requete.body.nationalite,
        biographie : requete.body.biographie,
        oscar:(requete.body.oscar)?true:false,
        cesar:(requete.body.cesar)?true:false,
        golden:(requete.body.golden)?true:false,
        image:requete.file.path.substring(14)
    })
    acteur.save()
    .then(resultat => {
        reponse.redirect("/admin_acteur");
    })
    .catch( error =>{
        console.log(error)
    });
}

exports.admin_acteur_delet = (requete,reponse)=>{
    var acteur = acteurModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(acteur => {
        fs.unlink("./public/images/"+acteur.image, error => {
            console.log(error);
        })
    },
    acteurModel.find()
        .where("nom").equals("anonyme")
        .exec()
        .then(acteur =>{
           
            filmModel.updateMany({"acteur":requete.params.id},{"$set":{"acteur":acteur[0]._id}},{"multi":true})
            .exec()
            .then(
                acteurModel.deleteOne({_id:requete.params.id})
                // empêche la suppresion
                // .$where("nom").ne("anonyme")
                .exec()
                .then(resultat => {
                    requete.session.message = {
                        type : 'success',
                        contenu : 'Suppression effectuée'
                    }
                    reponse.redirect("/admin_acteur");
                })
                .catch(error => {
                    console.log(error);
                })    
            )
            
        }) 
    )   
}

exports.admin_acteur_modification = (requete,reponse)=>{
    acteurModel.findById(requete.params.id)
        .populate("films")
        .exec()
        .then(acteur=>{
            reponse.render("acteurs/acteur.html.twig",{ acteur:acteur,isModification:true});
           
    })
    .catch( error =>{
        console.log(error)
    });
}



exports.admin_acteur_modification_bdd = (requete,reponse)=>{
    const acteurUpdate ={

        nom: requete.body.nom,
        prenom : requete.body.prenom,
        date_naissance:requete.body.date_naissance,
        nationalite :requete.body.nationalite,
        biographie : requete.body.biographie,
        oscar:(requete.body.oscar)?true:false,
        cesar:(requete.body.cesar)?true:false,
        golden:(requete.body.golden)?true:false,
    }
    acteurModel.updateOne({_id:requete.body.identifiant},acteurUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified < 1) throw new Error("Requete de modification échouée");
        requete.session.message = {
            type : 'success',
            contenu : 'modification effectuée'
        }
        reponse.redirect("/admin_acteur");
    }) 
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type : 'danger',
            contenu : error.message
        }
        reponse.redirect("/admin_acteur");
    })
}


exports.admin_acteur_update_image = (requete,reponse)=>{ 
    var acteur = acteurModel.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(acteur => {
        fs.unlink("./public/images/"+acteur.image, error => {
            console.log(error);
        })
        const acteurUpdate = {
            image : requete.file.path.substring(14)
        }
        acteurModel.updateOne({_id:requete.body.identifiant}, acteurUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/admin_acteur/modification/"+requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
    });
}