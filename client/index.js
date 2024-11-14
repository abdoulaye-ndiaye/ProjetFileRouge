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

app.listen(port, () => {
    console.log(`Serveur du client démarré sur le port ${port}`);
});
