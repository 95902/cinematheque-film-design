const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const evenement_controler = require("../controllers/evenement.controler")



///////////////////////
/////  EVENEMENTS //////////
///////////////////////
routeur.get("/evenement",evenement_controler.liste_evenement_affichage);
routeur.get("/evenement/:id",evenement_controler.evenement_details);





module.exports = routeur;