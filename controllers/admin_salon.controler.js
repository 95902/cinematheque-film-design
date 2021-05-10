const mongoose = require("mongoose");
const salonModel = require("../models/salon.modele");
const fs = require("fs");


exports.liste_salon_affichage=(requete,reponse)=>{
    salonModel.find()
    .exec()
    .then( salon=>{
        reponse.render("admin/ajout_salon.html.twig",{
            liste : salon,
            message:reponse.locals.message});
            console.log(salon)
    })
    .catch( error =>{
        console.log(error)
        });     
}

exports.admin_salon_modification = (requete,reponse)=>{
    salonModel.findById(requete.params.id)
        .exec()
        .then(salon=>{
            reponse.render("admin/detail_salon.html.twig",{
                salon:salon, 
                isModification:true
            });
        })
    .catch( error =>{
        console.log(error)
    });
}

exports.admin_salon_modification_bdd = (requete,reponse)=>{
    const salonmUpdate ={
        nom: requete.body.nom,
        description :requete.body.description,
    }
    salonModel.updateOne({_id:requete.body.identifiant},salonmUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified < 1) throw new Error("Requete de modification échouée");
        requete.session.message = {
            type : 'success',
            contenu : 'modification effectuée'
        }
        reponse.redirect("/admin_salon");
    }) 
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type : 'danger',
            contenu : error.message
        }
        reponse.redirect("/admin_salon");
    })
}


exports.admin_salon_update_image = (requete,reponse)=>{ 
    var salon = salonModel.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(salon => {
        fs.unlink("./public/images/"+salon.image, error => {
            console.log(error);
        })
        const salonUpdate = {
            image : requete.file.path.substring(14)
        }
        salonModel.updateOne({_id:requete.body.identifiant}, salonUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/admin_salon/modification/"+requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
    });
}

exports.salon_ajout =(requete,reponse)=>{ 
    const salon = new salonModel({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.nom,
        description :requete.body.description,
        image:requete.file.path.substring(14)
    });
    salon.save()
    .then(resultat => {
        reponse.redirect("/admin_salon");
    })
    .catch(error => {
        console.log(error);
    })
}


exports.admin_salon_delet = (requete,reponse)=>{
    var salon = salonModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(salon => {
        fs.unlink("./public/images/"+salon.image, error => {
            console.log(error);
        })
        salonModel.remove({_id:requete.params.id})
        .exec()
        .then(resultat => {
            requete.session.message = {
                type : 'success',
                contenu : 'Suppression effectuée'
            }
            reponse.redirect("/admin_salon");
        })
        .catch(error => {
            console.log(error);
        })
    })
    .catch(error => {
        console.log(error);
    })    
}