const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const film_new_controler = require("../controllers/film_new.controler")


///////////////////////
/////  FILM  //////////
///////////////////////
routeur.get("/films_new",film_new_controler.liste_film_new_affichage)





module.exports = routeur;