const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const webhookUtils = require('../utils/webhookUtils');

module.exports = {
    // envoyer une commande au fournisseur
    envoyerCommande : async (req, res) => {
        const { client, produits } = req.body; // `produits` est un tableau d'objets [{ refArticle, quantite }, ...]
    
        try {
            let produitsCommandes = []; // Stocker les informations sur les produits commandés
            let produitsQuantitevide = []; // Produits dont la quantité est vide
            let produitsQuantiteInsuffisante = []; // Produits dont la quantité est insuffisante

            // Boucler sur chaque produit de la commande
            for (let { refArticle, quantite } of produits) {
                const produit = await Produit.findOne({ ref: refArticle });

                if (!produit) {
                    return res.status(400).send(`Produit ${refArticle} non trouvé.`);
                } else if (produit.quantite < quantite) {
                    // Ajouter à la liste des produits avec quantité insuffisante
                    produitsQuantiteInsuffisante.push({
                        refArticle,
                        quantiteDemandee: quantite,
                        quantiteDisponible: produit.quantite
                    });
                } else if (produit.quantite == 0) {
                    // Ajouter à la liste des produits avec quantité vide
                    produitsQuantitevide.push({
                        refArticle,
                    });
                }
                else {
                    // Ajouter le produit à la liste des produits commandés
                    produitsCommandes.push({
                        produit: produit._id,
                        quantite
                    });

                }
            }
    
            // Vérifier si des produits sont insuffisants superieur à 0
            if (produitsQuantitevide.length > 0) {
                // Notifier le fournisseur et le client via un webhook les produits dont la quantité est vide
                await webhookUtils.envoyerNotificationProduitsVide(produitsQuantitevide);
                return res.status(400).send(`Les produits ${produitsQuantitevide.map(p => p.refArticle).join(', ')} sont en rupture de stock.`);
            }
            if (produitsQuantiteInsuffisante.length > 0) {
                // Notifier le fournisseur et le client via un webhook les produits dont la quantité est insuffisante
                await webhookUtils.envoyerNotificationProduits(produitsQuantiteInsuffisante);
                return res.status(400).send(`Quantité insuffisante pour les produits ${produitsQuantiteInsuffisante.map(p => p.refArticle).join(', ')}.`);
            }
            if (produitsCommandes.length > 0) {
                // Notifier le fournisseur et le client via un webhook les produits que la quantité est suffisante
                await webhookUtils.envoyerNotificationProduitsSuffisants(produitsCommandes);
                return res.status(200).send(`Commande du client ${client} au complète..`);
            }
    
            // Créer une nouvelle commande avec les produits disponibles
            if (produitsCommandes.length > 0 || produitsQuantiteInsuffisante.length > 0) {
                const commande = new Commande({
                    client,
                    produits: produitsCommandes || produitsQuantiteInsuffisante
                });
    
                const commandeSave = await commande.save();
                if (commandeSave) {
                    return res.status(200).send(`Commande confirmée pour ${client}. Les fournisseurs vont livrer.`);
                } else {
                    return res.status(400).send('Erreur lors de la commande.');
                }
            } else {
                return res.status(400).send('Aucun produit disponible pour la commande.');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur lors de la commande.');
        }
    }
}

