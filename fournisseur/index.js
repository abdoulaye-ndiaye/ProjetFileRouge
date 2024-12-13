const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT_FOURNISSEUR || 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Route pour recevoir le webhook de création de produit
app.post('/produit-cree', (req, res) => {
    const { event, data } = req.body;
    if (event === 'Produit créé') {
        console.log('Notification reçue - Produit créé :', data);
        // Traite ici la logique de notification du fournisseur, par exemple ajouter le produit à un inventaire
        res.status(200).send('Produit créé notifié au fournisseur');
    } else {
        res.status(400).send('Événement non supporté');
    }
});

// Route pour recevoir le webhook de mise à jour de produit
app.post('/produit-mis-a-jour', (req, res) => {
    const { event, data } = req.body;
    if (event === 'Produit mis à jour') {
        console.log('Notification reçue - Produit mis à jour :', data);
        // Traite la logique de mise à jour du produit
        res.status(200).send('Produit mis à jour notifié au fournisseur');
    } else {
        res.status(400).send('Événement non supporté');
    }
});

// Route pour recevoir le webhook de suppression de produit
app.post('/produit-supprime', (req, res) => {
    const { event, data } = req.body;
    if (event === 'Produit supprimé') {
        console.log('Notification reçue - Produit supprimé :', data);
        // Traite la logique de suppression du produit
        res.status(200).send('Produit supprimé notifié au fournisseur');
    } else {
        res.status(400).send('Événement non supporté');
    }
});

/**
 * Route pour recevoir la notification de produit insuffisant.
 */
app.post("/produit-insuffisant", (req, res) => {
    const { event, data } = req.body;
    console.log(`Fournisseur a reçu une notification : ${event}`);

    // Vérifier si `data.refArticle` est un tableau
    if (!Array.isArray(data.refArticle)) {
        return res.status(400).send("Erreur : 'refArticle' doit être un tableau.");
    }

    // Traitement spécifique pour informer le fournisseur de produire le produit manquant
    let message = `Fournisseur : ${data.fournisseur}\n\nNotification de produit insuffisant :\n\n`;

    // Calculer la quantité à produire pour chaque produit manquant
    data.refArticle.forEach((produit) => {
        message += `Produit : ${produit.refArticle}\n`;
        message += `Quantité demandée : ${produit.quantiteDemandee}\n`;
        message += `Quantité disponible : ${produit.quantiteDisponible}\n`;

        // Calcul de la quantité à produire si nécessaire
        let quantiteAProduire = produit.quantiteDemandee - produit.quantiteDisponible;
        if (quantiteAProduire > 0) {
            message += `Quantité à produire : ${quantiteAProduire}\n\n`;
        } else {
            message += `Aucune production nécessaire, quantité suffisante en stock.\n\n`;
        }
    });

    // Logique pour informer le fournisseur avec la quantité à produire
    console.log(message);
    res.status(200).send(message);
});

/**
 * Route pour recevoir la notification de commande modifiée par le client.
 */
app.post("/commande-modifiee-client", (req, res) => {
    const { event, data } = req.body;
    console.log("Notification de commande modifiée par le client :");
    console.log(data);
    res.status(200).send(`le client a modifié sa commande : ${data}`);  
})
/** 
 * Route pour recevoir la notification de commande modifiée par le fournisseur.
 */ 
app.post("/commande-modifiee-fournisseur", (req, res) => {
    const { event, data } = req.body;
    console.log("Votre commande a bien modifiée et notifier au client :");
    console.log(data);
    res.status(200).send(`Votre commande a bien modifiée et notifier au client : ${data}`);     
});

app.listen(port, () => {
    console.log(`Serveur du fournisseur démarré sur le port ${port}`);
});
