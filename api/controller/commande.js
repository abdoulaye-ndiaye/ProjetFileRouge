const Produit = require('../model/produit');
const Commande = require('../model/commande');
const webhookUtils = require('../utils/webhook');

module.exports = {
    // envoyer une commande au fournisseur
    envoyerCommande: async (req, res) => {
        const { client, produits,status } = req.body; // `produits` est un tableau [{ refArticle, quantiteCommande }]
        let produitsCommandes = [];
        let produitsQuantiteInsuffisante = [];
    
        try {
            // Boucle sur chaque produit de la commande
            for (let { refArticle, quantiteCommande } of produits) {
                const produit = await Produit.findOne({ ref: refArticle });
    
                if (produit) {
                    console.log(`Produit ${refArticle} trouvé.`)
                }else{
                    return res.status(400).send(`Produit ${refArticle} non trouvé.`);
                }
    
                if (produit.quantite < quantiteCommande) {
                    // Ajouter à la liste des produits en quantité insuffisante
                    produitsQuantiteInsuffisante.push({
                        refArticle,
                        quantiteDemandee: quantiteCommande,
                        quantiteDisponible: produit.quantite
                    });
                } else {
                    // Ajouter à la liste des produits commandés
                    produitsCommandes.push({
                        produit: produit._id,
                        quantiteCommande,
                        quantitelivre: quantiteCommande
                    });
    
                    // Mettre à jour le stock du produit
                    produit.quantite -= quantiteCommande;
                    await produit.save();
                }
            }
    
            // Si tous les produits sont insuffisants
            if (produitsCommandes.length === 0) {
                await webhookUtils.envoyerNotificationProduitsInsuffisants(client, produitsQuantiteInsuffisante);
                return res.status(400).send("Commande impossible : quantités insuffisantes pour tous les produits.");
            }
    
            // Créer la commande avec les produits disponibles
            const nouvelleCommande = new Commande({
                client,
                produits: produitsCommandes,
                statut: status
            });
    
            const commandeSave = await nouvelleCommande.save();
    
            // Envoi des notifications
            if (produitsQuantiteInsuffisante.length > 0) {
                await webhookUtils.envoyerNotificationProduitsInsuffisants(client, produitsQuantiteInsuffisante);
                await webhookUtils.envoyerNotificationCommandePartielle(produitsQuantiteInsuffisante, produitsCommandes, client);
                res.status(206).send({
                    message: "Commande partiellement créée. Certains produits sont en quantité insuffisante.",
                    commande: commandeSave,
                    produitsInsuffisants: produitsQuantiteInsuffisante
                });
            } else {
                res.status(200).send({
                    message: "Commande créée avec succès.",
                    commande: commandeSave
                });
            }
        } catch (error) {
            console.error("Erreur lors de la commande :", error);
            res.status(500).send("Erreur interne du serveur.");
        }
    },
    // Modifier commande (client)
    modifierCommandeClient: async (req, res) => {
        const { produits, quantiteCommande } = req.body;
        const idCommande = req.params.id;
      
        // Validation des données de la commande
        if (!idCommande || !produits || !quantiteCommande) {
          return res.status(400).send("Les champs idCommande, produits et quantiteCommande sont obligatoires.");
        }
      
        // Récupération de la commande à modifier
        const commande = await Commande.findOne({ _id: idCommande });
        if (!commande) {
          return res.status(404).send("La commande n'existe pas.");
        }
      
        // Mise à jour des produits de la commande
        const produitsValides = [];
        const produitsInvalides = [];
        const notificationsClient = {
          produitsInsuffisants: [],
          produitsDisponibles: []
        };
      
        for (const produit of produits) {
          if (!produit.refArticle || !produit.quantiteCommande) {
            produitsInvalides.push(produit);
            continue;
          }
      
          const produitExistant = await Produit.findOne({ ref: produit.refArticle });
          if (!produitExistant) {
            produitsInvalides.push(produit);
            continue;
          }
      
          // Vérifier la disponibilité du produit
          const quantiteDemandee = produit.quantiteCommande;
          const quantiteDisponible = produitExistant.quantite || 0;
      
          if (quantiteDemandee > quantiteDisponible) {
            // Gérer les produits insuffisants
            if (quantiteDisponible > 0) {
              notificationsClient.produitsInsuffisants.push({
                produit: produitExistant.ref,
                quantiteDemandee,
                quantiteDisponible,
                quantiteEnvoyee: quantiteDisponible
              });
      
              notificationsClient.produitsDisponibles.push({
                produit: produitExistant._id,
                quantiteDemandee: quantiteDemandee - quantiteDisponible
              });
      
              // Mettre à jour la quantité validée
              produitsValides.push({
                produit: produitExistant,
                quantiteCommande: quantiteDisponible
              });
            } else {
              notificationsClient.produitsInsuffisants.push({
                produit: produitExistant.ref,
                quantiteDemandee,
                quantiteDisponible: 0,
                messageSupplementaire: "Aucune quantité disponible pour ce produit, mais sera envoyé ultérieurement."
              });
      
              // Ne pas ajouter ce produit aux produits valides
            }
          } else {
            // Produit disponible en quantité suffisante
            produitsValides.push({
              produit: produitExistant,
              quantiteCommande: quantiteDemandee
            });
          }
        }
      
        if (produitsInvalides.length > 0) {
          return res.status(400).send("Les produits suivants sont invalides : " + produitsInvalides.map(p => p.refArticle).join(", "));
        }
      
        // Mettre à jour les produits de la commande
        commande.produits = produitsValides.map(produit => ({
          produit: produit.produit._id,
          quantiteCommande: produit.quantiteCommande,
          quantitelivre: produit.quantiteCommande
        }));
      
        // Sauvegarde de la commande modifiée
        await commande.save();
      
        // Envoi des notifications
        const notificationPayload = {
          message: "Notification de commande",
          produitsInsuffisants: notificationsClient.produitsInsuffisants,
          produitsDisponibles: notificationsClient.produitsDisponibles
        };
      
         // Envoi des notifications
         await webhookUtils.envoyerNotificationCommandeModifieeClient(notificationPayload);
      
      
        res.status(200).send({
          message: "Commande modifiée avec succès.",
          commande: commande,
          notifications: notificationPayload
        });
    },
    
    // Modifier commande (fournisseur)
    modifierCommandeFournisseur: async (req, res) => {
        const { produits } = req.body;
        const idCommande = req.params.id;
      
        // Validation des données de la commande
        if (!idCommande || !produits) {
          return res.status(400).send("Les champs idCommande et produits sont obligatoires.");
        }
      
        // Récupération de la commande à modifier
        const commande = await Commande.findOne({ _id: idCommande });
        if (!commande) {
          return res.status(404).send("La commande n'existe pas.");
        }
      
        // Ajout des nouveaux produits à la commande
        produits.forEach(produit => {
          const produitExistant = commande.produits.find(p => p.produit.toString() === produit.refArticle);
          if (!produitExistant) {
            commande.produits.push({
              produit: produit.refArticle,
              quantiteCommande: produit.quantiteDisponible,
              quantitelivre: produit.quantiteDisponible
            });
          }
        });
      
        
          // Mise à jour du statut de la commande
          commande.status = "COMPLET";
      
          // Envoi des notifications
          await webhookUtils.envoyerNotificationCommandeComplete(commande);
       
      
        // Sauvegarde de la commande modifiée
        await commande.save();
      
        res.status(200).send({
          message: "Commande modifiée avec succès.",
          commande: commande
        });
      },

    // Récupérer toutes les commandes
    getAllCommandes : async (req, res) => {
        try {
            const commandes = await Commande.find();
            res.status(200).json(commandes);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
        }
    },

    // Récupérer une commande par ID
    getCommandeById : async (req, res) => {
        try {
            const commande = await Commande.findById(req.params.id);
            if (!commande) {
                return res.status(404).json({ message: "Commande non trouvée" });
            }
            res.status(200).json(commande);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la commande", error });
        }
    },

    // Supprimer une commande
    deleteCommande : async (req, res) => {
        try {
            await Commande.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Commande supprimée avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la commande", error });
        }
    },

    // Récupérer les commandes d'un client spécifique
    getCommandesByClient : async (req, res) => {
        try {
            const commandes = await Commande.find({ client: req.params.clientId });
            res.status(200).json(commandes);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des commandes du client", error });
        }
    }

}
