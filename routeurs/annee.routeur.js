const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const multer    =require("multer");
const admin_film_controler = require("../controllers/admin_film.controler")
const admin_annees_controler=require("../controllers/annee.controler");


routeur.get("/annees",admin_annees_controler.liste_annees_affichage);
routeur.get("/annees/:id",admin_annees_controler.annees_affichages);
module.exports = routeur;
