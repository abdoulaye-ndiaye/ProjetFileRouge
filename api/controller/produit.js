const Produit = require('../models/produitModel');
const Commande = require('../models/commandeModel');
const webhookUtils = require('../utils/webhook');  // Utilitaires pour envoyer des webhooks

module.exports = {
        // Envoie de commande par le client
        envoyerCommande : async (req, res) => {
        const { client, refArticle, quantite } = req.body;

        try {
            const produit = await Produit.findOne({ ref: refArticle });

            if (produit && produit.quantite >= quantite) {
            // Créer une nouvelle commande
            const commande = new Commande({
                client,
                produits: [{ produit: produit._id, quantite }],
            });
            const commandeSave = await commande.save();
                if (!commandeSave) {
                    res.status(400).send('Erreur lors de la commande');
                }else{
                // Notifier le fournisseur via un webhook
                await webhookUtils.envoyerNotification(produit.fournisseur, refArticle, quantite);
                res.status(200).send(`Commande confirmée pour ${client}. Le fournisseur ${produit.fournisseur} va livrer.`);
                }
            } else {
            res.status(400).send('Quantite insuffisant pour cet article.');
            }
        } catch (err) {
            res.status(500).send('Erreur lors de la commande');
        }
        },

        // Mettre à jour les stocks
        updateQuantite : async (req, res) => {
        const { refArticle, quantite } = req.body;
        try {
            const produit = await Produit.findOne({ ref: refArticle });

            if (produit) {
            produit.quantite += quantite;
            await produit.save();
            res.status(200).send(`Stock mis à jour pour ${refArticle}`);
            } else {
            res.status(400).send('Article non trouvé');
            }
        }
        catch (err) {
            res.status(500).send('Erreur lors de la mise à jour du stock');
        }
        }
};
