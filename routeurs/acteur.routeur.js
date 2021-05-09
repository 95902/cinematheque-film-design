const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const multer    =require("multer");
const acteur_controler = require("../controllers/acteur.controler")


routeur.get("/acteurs/:id",acteur_controler.acteur_affichage);
routeur.get("/acteurs",acteur_controler.liste_acteurs_affichage);
routeur.get('/acteurs/:start/:limit',acteur_controler.acteur_pagination);

module.exports=routeur;