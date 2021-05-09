const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const multer    =require("multer");
const salon_controler = require("../controllers/salon.controler")


 
routeur.get("/salon",salon_controler.salon_affichage);
routeur.get("/liste_salon",salon_controler.liste_salon_affichage);
// routeur.get("/acteurs/:id",acteur_controler.acteur_affichage);
// routeur.get("/acteurs",acteur_controler.liste_acteurs_affichage);
// routeur.get('/acteurs/:start/:limit',acteur_controler.acteur_pagination);

module.exports=routeur;