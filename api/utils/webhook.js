const axios = require("axios");
const portFournisseur = process.env.PORT_FOURNISSEUR;
const portClient = process.env.PORT_CLIENT;

module.exports = {
    /**
     * Envoie une notification au fournisseur lorsque la quantité d'un produit est insuffisante.
     * @param {String} fournisseur - Nom du fournisseur
     * @param {String} refArticle - Référence de l'article
     * @param {Number} quantite - Quantité demandée
     */
    envoyerNotificationProduitsInsuffisants: async (fournisseur, refArticle, quantite) => {
        try {
            await axios.post(`http://localhost:${portFournisseur}`, {
                fournisseur,
                refArticle,
                quantite,
            });
            console.log("Notification envoyée au fournisseur pour stock insuffisant");
        } catch (error) {
            console.error("Erreur lors de l'envoi du webhook au fournisseur :", error.message);
            throw new Error("Webhook de stock insuffisant non envoyé");
        }
    },

    /**
     * Envoie un webhook pour notifier la création d'un produit.
     * @param {Object} produit - Données du produit créé
     */
    envoyerNotificationCreationProduit: async (produit) => {
        try {
            // Notification au fournisseur
            await axios.post(`http://localhost:${portFournisseur}/produit-cree`, {
                event: "Produit créé",
                data: produit,
            });
            console.log("Notification de création de produit envoyée au fournisseur");

            // Notification au client
            await axios.post(`http://localhost:${portClient}/produit-cree`, {
                event: "Produit créé",
                data: produit,
            });
            console.log("Notification de création de produit envoyée au client");

        } catch (error) {
            console.error("Erreur lors de l'envoi des webhooks de création de produit :", error.message);
            throw new Error("Webhooks de création de produit non envoyés");
        }
    },

    /**
     * Envoie un webhook pour notifier la mise à jour d'un produit.
     * @param {Object} produit - Données du produit mis à jour
     */
    envoyerNotificationMiseAJourProduit: async (produit) => {
        try {
            await axios.post(`http://localhost:${portFournisseur}/produit-mis-a-jour`, {
                event: "Produit mis à jour",
                data: produit,
            });
            console.log("Notification de mise à jour de produit envoyée au fournisseur");
        } catch (error) {
            console.error("Erreur lors de l'envoi du webhook de mise à jour de produit :", error.message);
            throw new Error("Webhook de mise à jour de produit non envoyé");
        }
    },

    /**
     * Envoie un webhook pour notifier la suppression d'un produit.
     * @param {Object} produit - Données du produit supprimé
     */
    // Envoyer un webhook pour notifier la suppression du produit au fournisseur et au client
    envoyerNotificationSuppressionProduit: async (produit) => {
        try {
            // Notification au fournisseur
            await axios.post(`http://localhost:${portFournisseur}/produit-supprime`, {
                event: "Produit supprimé",
                data: produit,
            });
            console.log("Notification de suppression de produit envoyée au fournisseur");

            // Notification au client
            await axios.post(`http://localhost:${portClient}/produit-supprime`, {
                event: "Produit supprimé",
                data: produit,
            });
            console.log("Notification de suppression de produit envoyée au client");

        } catch (error) {
            console.error("Erreur lors de l'envoi du webhook de suppression de produit :", error.message);
            throw new Error("Webhook de suppression de produit non envoyé");
        }
    },
};
