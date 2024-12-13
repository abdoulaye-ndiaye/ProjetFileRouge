const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT_CLIENT || 3002;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Route pour recevoir le webhook de création de produit
app.post('/produit-cree', (req, res) => {
    const { event, data } = req.body;

    if (event === 'Produit créé') {
        const { nom, prix } = data.data;  // Extraction du nom et du prix du produit

        console.log('Notification reçue - Nouveau produit disponible dans le catalogue du fournisseur:');
        console.log(`Nom du produit: ${nom}`);
        console.log(`Prix du produit: ${prix}`);
        
        // Traite ici la logique de notification au client, par exemple afficher le produit dans le catalogue
        res.status(200).send('Produit créé notifié au client');
    } else {
        res.status(400).send('Événement non supporté');
    }
});


// Route pour recevoir le webhook de mise à jour de produit
app.post('/produit-mis-a-jour', (req, res) => {
    const { event, data } = req.body;
    if (event === 'Produit mis à jour') {
        console.log('Notification reçue - Produit mis à jour :', data);
        // Traite la logique de mise à jour du produit sur le site client
        res.status(200).send('Produit mis à jour notifié au client');
    } else {
        res.status(400).send('Événement non supporté');
    }
});

// Route pour recevoir le webhook de suppression de produit
app.post('/produit-supprime', (req, res) => {
    const { event, data } = req.body;
    if (event === 'Produit supprimé') {
        const { nom } = data.data;  // Extraction du nom et du prix du produit
        console.log('Notification reçue - Le fournisseur a supprimé le produit du Nom de :');
        console.log(`Nom du produit: ${nom}`);
        // Traite la logique de suppression du produit chez le client
        res.status(200).send('Produit supprimé notifié au client');
    } else {
        res.status(400).send('Événement non supporté');
    }
});

/**
 * Route pour recevoir la notification de produit insuffisant.
 */
app.post("/produit-insuffisant", (req, res) => {
    const { event, data } = req.body;
    console.log(`Client a reçu une notification : ${event}`);

    // Vérification de la structure de 'data'
    if (!data || !Array.isArray(data.refArticle)) {
        return res.status(400).send("Erreur : 'data.refArticle' doit être un tableau.");
    }

    // Construction du message pour le client
    let message = "Notification de produit insuffisant :\n\n";

    // Variables pour suivre les produits disponibles et insuffisants
    let produitsDisponibles = [];
    let produitsInsuffisants = [];

    // Parcourir chaque produit pour construire le message
    data.refArticle.forEach((produit) => {
        message += `Produit : ${produit.refArticle}\n`;
        message += `Quantité demandée : ${produit.quantiteDemandee}\n`;
        message += `Quantité disponible : ${produit.quantiteDisponible}\n`;

        // Si la quantité demandée est inférieure ou égale à la quantité disponible
        if (produit.quantiteDisponible > 0) {
            produitsDisponibles.push({
                refArticle: produit.refArticle,
                quantiteEnvoyee: produit.quantiteDisponible
            });
            message += `Quantité qui sera envoyée : ${produit.quantiteDisponible}\n\n`;
        } else {
            produitsInsuffisants.push(produit.refArticle);
            message += `Aucune quantité disponible pour ce produit,mais sera envoyé ultérieurement.\n\n`;
        }
    });

    // Logique pour informer le client avec la quantité disponible
    console.log(message);
    res.status(200).send(message);
});



/**
 * Route pour recevoir la notification de commande partielle.
 */
app.post("/commande-partielle", (req, res) => {
    const { event, data } = req.body;
    console.log("Notification de Produits disponibles :");

    // Vérification que 'data.produitsDisponibles' est un tableau et non vide
    if (Array.isArray(data.produitsDisponibles) && data.produitsDisponibles.length > 0) {
        // Parcourir le tableau des produits disponibles
        data.produitsDisponibles.forEach((produit) => {
            console.log(`Produit : ${produit.produit}`);
            console.log(`Quantité demandée : ${produit.quantiteCommande}`);
        });
    } else {
        console.log("Aucun produit disponible dans la commande.");
    }

    res.status(200).send("Notification de commande partielle reçue par le client.");
});

/**
 * Route pour recevoir la notification de commande modifiée par le client.
 */
app.post("/commande-modifiee-client", (req, res) => {
    const { event, data } = req.body;
    console.log("Votre commande a bien modifiée :");
    console.log(data);
    res.status(200).send("Votre commande a bien modifiée et notifier au fournisseur.");
});

/** 
 * Route pour recevoir la notification de commande modifiée par le fournisseur.
 */
app.post("/commande-modifiee-fournisseur", (req, res) => {
    const { event, data } = req.body;
    console.log("Notification de commande modifiée par le fournisseur :");
    console.log("le fournisseur a mise à jour la commande :");
    console.log(data);
    res.status(200).send(`le fournisseur a modifié la commande : ${data}`);
});


app.listen(port, () => {
    console.log(`Serveur du client démarré sur le port ${port}`);
});
