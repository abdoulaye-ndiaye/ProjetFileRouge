const Produit = require("../model/produit");
const Entreprise = require("../model/entreprise");
const webhookUtils = require("../utils/webhook");

module.exports = {
    // 1. Récupérer tous les produits
    getAllProduits: async (req, res) => {
        try {
            const produits = await Produit.find().populate("entreprise");
            res.status(200).json(produits);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
        }
    },

    // 2. Récupérer un produit par ID
    getProduitById: async (req, res) => {
        try {
            const produit = await Produit.findById(req.params.id).populate("entreprise");
            if (!produit) {
                return res.status(404).json({ message: "Produit non trouvé" });
            }
            res.status(200).json(produit);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du produit", error });
        }
    },

    // 3. Ajouter un nouveau produit
    createProduit: async (req, res) => {
        try {
            const { ref, nom, quantite, prix, entreprise, description } = req.body;

            // Vérifier si l'entreprise existe
            const entrepriseExiste = await Entreprise.findById(entreprise);
            if (!entrepriseExiste) {
                return res.status(404).json({ message: "Entreprise non trouvée" });
            }

            const nouveauProduit = new Produit({
                ref,
                nom,
                quantite,
                prix,
                entreprise,
                description,
            });

            const produit = await nouveauProduit.save();

            // Envoyer un webhook pour notifier la création du produit
            await webhookUtils.envoyerNotificationCreationProduit({
                event: "Produit créé",
                data: produit,
            });

            res.status(201).json(produit);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du produit", error });
        }
    },

    // 4. Mettre à jour un produit
    updateProduit: async (req, res) => {
        try {
            const { ref, nom, quantite, prix, description, actif } = req.body;
            const produit = await Produit.findByIdAndUpdate(
                req.params.id,
                { ref, nom, quantite, prix, description, actif },
                { new: true }
            );

            if (!produit) {
                return res.status(404).json({ message: "Produit non trouvé" });
            }

            // Envoyer un webhook pour notifier la mise à jour du produit
            await webhookUtils.sendWebhook({
                event: "Produit mis à jour",
                data: produit,
            });

            res.status(200).json(produit);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error });
        }
    },

    // 5. Supprimer un produit
    deleteProduit: async (req, res) => {
        try {
            const produit = await Produit.findByIdAndDelete(req.params.id);

            if (!produit) {
                return res.status(404).json({ message: "Produit non trouvé" });
            }

            // Envoyer un webhook pour notifier la suppression du produit
            await webhookUtils.envoyerNotificationSuppressionProduit({
                event: "Produit supprimé",
                data: produit,
            });

            res.status(200).json({ message: "Produit supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
        }
    },

    // 6. Rechercher des produits par entreprise
    getProduitsByEntreprise: async (req, res) => {
        try {
            const { entrepriseId } = req.params;
            const produits = await Produit.find({ entreprise: entrepriseId }).populate("entreprise");
            res.status(200).json(produits);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des produits de l'entreprise", error });
        }
    },

    // 7. Filtrer les produits actifs
    getProduitsActifs: async (req, res) => {
        try {
            const produits = await Produit.find({ actif: true }).populate("entreprise");
            res.status(200).json(produits);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des produits actifs", error });
        }
    },
};
