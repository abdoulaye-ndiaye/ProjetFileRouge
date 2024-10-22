const express = require('express');
const routes = express.Router();

//controller Entreprise
const entrepriseController = require('../controller/entreprise');

routes.post('/entreprise', entrepriseController.createEntreprise);
routes.put('/entreprise', entrepriseController.updateEntreprise);
//controller User
const userController = require('../controller/User');

routes.post('/user', userController.createUser);
routes.put('/user', userController.updateUser);

//controller Produit
const produitController = require('../controller/produit');



module.exports = routes;