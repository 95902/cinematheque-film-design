const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const multer    =require("multer");
const admin_film_controler = require("../controllers/admin_film.controler")
const admin_categories_controler=require("../controllers/categorie.controler");


routeur.get("/categories",admin_categories_controler.liste_categories_affichage);
 routeur.get("/categories/:id",admin_categories_controler.categorie_affichages);
module.exports = routeur;
