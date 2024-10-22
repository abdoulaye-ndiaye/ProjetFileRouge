const Produit = require('../models/produitModel');
const Commande = require('../models/commandeModel');
const webhookUtils = require('../utils/webhook');  // Utilitaires pour envoyer des webhooks

module.exports = {
    // ajouter un produit
    ajouterProduit : async (req, res) => {
        const { ref, nom, fournisseur, quantite , prix} = req.body;

        try {
            const produit = new Produit({
                ref,
                nom,
                fournisseur,
                quantite,
                prix
            });
            const produitSave = await produit.save();
            if (!produitSave) {
                res.status(400).send('Erreur lors de l\'ajout du produit');
            } else {
                res.status(200).send('Produit ajouté');
            }
        } catch (err) {
            res.status(500).send('Erreur lors de l\'ajout du produit');
        }
    },
    //
}