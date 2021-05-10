const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const multer    =require("multer");
const admin_film_controler = require("../controllers/admin_film.controler");
const admin_acteur_controler=require("../controllers/admin_acteur.controler");
const admin_evenement_controler = require("../controllers/admin_evenement.controler");
const admin_salon_controler = require("../controllers/admin_salon.controler")



const storage=multer.diskStorage({
    destination: (requete,file,cb)=>{
        cb(null,"./public/images/")
    },
    filename:(requete,file,cb)=>{
        var date = new Date().getMonth();
        cb(null,date+"-"+Math.round(Math.random()*10000)+"-"+file.originalname)
    }

});
const fileFilter=(requete,file,cb)=>{
    if(file.mimetype ==="image/jpeg"||file.mimetype=="image/png"){
        cb(null,true)
    }else{
        cb(new Error("l'image n'est pas acceptée"),false)
    }

}
const upload = multer({
    storage : storage,
    limits :{
        fileSize:1024*1024*5
    },
    fileFilter : fileFilter
})


///////////////////////
/////  FILM//////////
///////////////////////
// admin_film liste film 
routeur.get("/admin_film",admin_film_controler.admin_film_affichage);
//admin_film detail film
routeur.get("/admin_film/:id",admin_film_controler.admin_film_detail);
//admin_film modification film 
routeur.get('/admin_film/modification/:id',admin_film_controler.admin_film_modification);
//admin_film modification film bdd
routeur.post('/admin_film/modificationServer',admin_film_controler.admin_film_modification_bdd);
//admin_film update image
routeur.post("/admin_film/updateImage",upload.single("image"),admin_film_controler.admin_film_update_image);
// admin_film ajout film bdd
routeur.post("/admin_film",upload.single("image"),admin_film_controler.admin_film_ajout);
//admi delete film bdd
routeur.post("/admin_film/delete/:id",admin_film_controler.admin_film_delet);

///////////////////////
/////EVENEMENT/////////
///////////////////////

// admin_evenement liste film 
routeur.get("/admin_evenement",admin_evenement_controler.admin_evenement_affichage);

// admin_evenement ajout evenement bdd
routeur.post("/admin_evenement",upload.single("image"),admin_evenement_controler.admin_evenement_ajout);

//admin_evenement modification evenement
routeur.get('/admin_film/modification/:id',admin_evenement_controler.admin_evenement_modification);

//admin_evenement modification evenement bdd
routeur.post('/admin_evenement/modificationServer',admin_evenement_controler.admin_evenement_modification_bdd);

//admin_evenement update image
routeur.post("/admin_evenement/updateImage",upload.single("image"),admin_evenement_controler.admin_evenement_update_image);

//admi delete evenement bdd
routeur.post("/admin_evenement/delete/:id",admin_evenement_controler.admin_evenement_delet);


///////////////////////
/////ACTEUR//////////
///////////////////////
routeur.get("/admin_acteur",admin_acteur_controler.liste_acteurs_affichage);
routeur.get("/admin_acteur/modification/:id",admin_acteur_controler.admin_acteur_modification);
routeur.post('/admin_acteur/modificationServer',admin_acteur_controler.admin_acteur_modification_bdd);
routeur.post("/admin_acteur/updateImage",upload.single("image"),admin_acteur_controler.admin_acteur_update_image);
routeur.post("/admin_acteur/delete/:id",admin_acteur_controler.admin_acteur_delet);
routeur.post("/admin_acteur",upload.single("image"),admin_acteur_controler.acteur_ajout);

///////////////////////
/////SALON//////////
///////////////////////
routeur.get("/admin_salon",admin_salon_controler.liste_salon_affichage);
routeur.get("/admin_salon/modification/:id",admin_salon_controler.admin_salon_modification);
routeur.post('/admin_salon/modificationServer',admin_salon_controler.admin_salon_modification_bdd);
routeur.post("/admin_salon/updateImage",upload.single("image"),admin_salon_controler.admin_salon_update_image);
routeur.post("/admin_salon/delete/:id",admin_salon_controler.admin_salon_delet);
routeur.post("/admin_salon",upload.single("image"),admin_salon_controler.salon_ajout);


module.exports = routeur;