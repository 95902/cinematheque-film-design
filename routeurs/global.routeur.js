const express = require("express");
const routeur = express.Router();
const twig    = require("twig");
const film_controler = require("../controllers/film.controler");
const evenement_controler = require("../controllers/evenement.controler");

routeur.get("/",film_controler.liste_film_affichage);

// routeur.get("/",evenement_controler.liste_evenement_affichage);


routeur.use((requete,reponse,suite) => {
    const error = new Error("Page non trouvée");
    error.status= 404;
    suite(error);
})

routeur.use((error,requete,reponse) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
})





module.exports = routeur;