const express = require('express');
const routes = express.Router();

//controller Entreprise
const entrepriseController = require('../controller/entreprise');

routes.post('/entreprise', entrepriseController.createEntreprise);
routes.put('/entreprise', entrepriseController.updateEntreprise);

//controller Produit
const produitController = require('../controller/produit');

routes.get("/produit", produitController.getAllProduits);
routes.get("/produit/:id", produitController.getProduitById);
routes.post("/produit", produitController.createProduit);
routes.put("/update-produit/:id", produitController.updateProduit);
routes.delete("/delete-produit/:id", produitController.deleteProduit);
routes.get("/produit-entreprise/:entrepriseId", produitController.getProduitsByEntreprise);
routes.get("/produit-actifs", produitController.getProduitsActifs);

// Controller Commande
const commandeController = require('../controller/commande');

routes.post("/commande", commandeController.envoyerCommande);
routes.put("/commande-fournisseur/:id", commandeController.modifierCommandeFournisseur);
routes.put("/commande-client/:id", commandeController.modifierCommandeClient);
routes.get("/commande", commandeController.getAllCommandes);
routes.get("/commande/:id", commandeController.getCommandeById);
routes.delete("/commande/:id", commandeController.deleteCommande);
routes.get("/commandes-client/:clientId", commandeController.getCommandesByClient);




module.exports = routes;