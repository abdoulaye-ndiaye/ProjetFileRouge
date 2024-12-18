const express = require('express');
const routes = express.Router();
const multer = require("multer");
const moment = require('moment');

var storageDocument = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents");
  },
  filename: function (req, file, cb) {
    const now = moment().format('YYYY_MM_DD_HH_mm_ss');
    cb(null, `${now}_${file.originalname}`);
  }
});

//controller Entreprise
const entrepriseController = require('../controller/entreprise');

routes.post('/entreprise', entrepriseController.createEntreprise);
routes.put('/entreprise', entrepriseController.updateEntreprise);
routes.get('/entreprise', entrepriseController.getAll);
routes.get('/entreprise/:id', entrepriseController.getById);
routes.delete('/entreprise/:id', entrepriseController.deleteEntreprise);

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

var uploadDocument = multer({ storage: storageDocument });
// controller Document
const DocumentService = require('../controller/document');

routes.post('/document', uploadDocument.single("document") ,DocumentService.create);
routes.get('/document', DocumentService.findAll);
routes.get('/document/:id', DocumentService.findOne);
routes.put('/document/:id', DocumentService.update);
routes.delete('/document/:id', DocumentService.delete);


module.exports = routes;