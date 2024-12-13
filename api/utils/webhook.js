const axios = require("axios");
const portFournisseur = process.env.PORT_FOURNISSEUR;
const portClient = process.env.PORT_CLIENT;
const localhost = "0.0.0.0"

/**
 * Fonction générique pour envoyer des notifications via webhook.
 * @param {String} url - L'URL du webhook.
 * @param {String} event - Type d'événement.
 * @param {Object} data - Données à envoyer.
 * @param {String} destinataire - Le destinataire (client ou fournisseur).
 */
const envoyerWebhook = async (url, event, data, destinataire) => {
    try {
        if (!url) throw new Error(`URL du webhook non définie pour ${destinataire}`);
        await axios.post(url, { event, data });
        console.log(`Notification ${event} envoyée à ${destinataire}`);
    } catch (error) {
        console.error(`Erreur lors de l'envoi du webhook à ${destinataire} (${event}) :`, error.message);
        throw new Error(`Webhook ${event} non envoyé à ${destinataire}`);
    }
};

module.exports = {
    /**
     * Envoie une notification lorsque la quantité d'un produit est insuffisante.
     * @param {String} fournisseur - Nom du fournisseur.
     * @param {String} refArticle - Référence de l'article.
     * @param {Number} quantite - Quantité demandée.
     */
    envoyerNotificationProduitsInsuffisants: async (fournisseur, refArticle, quantite) => {
        const data = { fournisseur, refArticle, quantite };

        // Notification au fournisseur
        await envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/produit-insuffisant`,
            "Produit insuffisant",
            data,
            "fournisseur"
        );

        // Notification au client
        await envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/produit-insuffisant`,
            "Produit insuffisant",
            { refArticle, quantite },
            "client"
        );
    },

    /**
     * Envoie une notification pour la création d'un produit.
     * @param {Object} produit - Données du produit créé.
     */
    envoyerNotificationCreationProduit: async (produit) => {
        // Notification au fournisseur
        await envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/produit-cree`,
            "Produit créé",
            produit,
            "fournisseur"
        );

        // Notification au client
        await envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/produit-cree`,
            "Produit créé",
            produit,
            "client"
        );
    },

    /**
     * Envoie une notification pour la mise à jour d'un produit.
     * @param {Object} produit - Données du produit mis à jour.
     */
    envoyerNotificationMiseAJourProduit: async (produit) => {
        // Notification au fournisseur
        await envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/produit-mis-a-jour`,
            "Produit mis à jour",
            produit,
            "fournisseur"
        );

        // Notification au client
        await envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/produit-mis-a-jour`,
            "Produit mis à jour",
            produit,
            "client"
        );
    },

    /**
     * Envoie une notification pour la suppression d'un produit.
     * @param {Object} produit - Données du produit supprimé.
     */
    envoyerNotificationSuppressionProduit: async (produit) => {
        // Notification au fournisseur
        await envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/produit-supprime`,
            "Produit supprimé",
            produit,
            "fournisseur"
        );

        // Notification au client
        await envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/produit-supprime`,
            "Produit supprimé",
            produit,
            "client"
        );
    },

    /**
     * Envoie une notification pour une commande partiellement validée.
     * @param {Array} produitsInsuffisants - Liste des produits insuffisants.
     * @param {Array} produitsDisponibles - Liste des produits disponibles.
     * @param {String} client - Nom du client.
     */
    envoyerNotificationCommandePartielle: async (produitsInsuffisants, produitsDisponibles, client) => {
        // Notification au fournisseur pour produire les produits insuffisants
        //await envoyerWebhook(
        //    `http://${localhost}:${portFournisseur}/commande-partielle`,
        //   "Commande partielle",
        //    { produitsInsuffisants },
        //    "fournisseur"
        //);

        // Notification au client pour lui indiquer les produits disponibles
        await envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/commande-partielle`,
            "Commande partielle",
            { produitsDisponibles },
            "client"
        );
    },

    /**
     * Envoie une notification pour une commande modifier par le client.
     * @param {Object} commande - Données de la commande modifiée.
     */
    envoyerNotificationCommandeModifieeClient(notificationPayload) {
        // Notification au client
        envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/commande-modifiee-client`,
            "Commande modifiée",
            notificationPayload,
            "client"
        )
        // Notification au fournisseur
        envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/commande-modifiee-client`,
            "Commande modifiée",
            notificationPayload,
            "fournisseur"
        );
    },

    /**
     * Envoie une notification pour une commande modifier par le fournisseur.
     * @param {Object} commande - Données de la commande modifiée.
     */
    envoyerNotificationCommandeModifieeFournisseur(commande) {
        // Notification au fournisseur
        envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/commande-modifiee-fournisseur`,
            "Commande modifiée",
            commande,
            "fournisseur"
        )
        // Notification au client
        envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/commande-modifiee-fournisseur`,
            "Commande modifiée",
            commande,
            "client"
        );
    },


    envoyerNotificationCommandeComplete(commande) {
        // Notification au fournisseur
        envoyerWebhook(
            `http://projetfilerouge-fournisseur-1:${portFournisseur}/commande-modifiee-fournisseur`,
            "Commande completee",
            commande,
            "fournisseur"
        )
        // Notification au client
        envoyerWebhook(
            `http://projetfilerouge-client-1:${portClient}/commande-modifiee-fournisseur`,
            "Commande completee",
            commande,
            "client"
        );
    },
};
