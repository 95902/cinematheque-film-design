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
routeur.post('/do-Like',film_controler.doLike)



module.exports = routeur;