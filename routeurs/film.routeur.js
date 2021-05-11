const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const film_controler = require("../controllers/film.controler")


///////////////////////
/////  FILM  //////////
///////////////////////
routeur.get("/films",film_controler.liste_film_affichage)
routeur.get("/films/:id",film_controler.film_details)

routeur.get('/films/:start/:limit',film_controler.film_pagination)
routeur.post("/doLike",film_controler.doLike)
routeur.post("/doDisLike",film_controler.dislikes)


module.exports = routeur;