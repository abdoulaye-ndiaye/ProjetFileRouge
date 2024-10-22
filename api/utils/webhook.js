const axios = require('axios');
const portFournisseur = process.env.PORT_FROUNISSEUR;
const portClient = process.env.PORT_CLIENT;

Module.exports = {
    // Envoyer un webhook au fournisseur pour lui notifier que la quantité des produit est insuffisante
    envoyerNotificationProduitsInsuffisants : async (fournisseur, refArticle, quantite) => {
        try {
        await axios.post(`http://localhost:${portFournisseur}`, {
            fournisseur,
            refArticle,
            quantite
        });
        console.log('Notification envoyée au fournisseur');
        } catch (error) {
        console.error('Erreur lors de l\'envoi du webhook', error);
        throw new Error('Webhook non envoyé');
        }
    },

}

