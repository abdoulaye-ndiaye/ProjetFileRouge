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

app.listen(port, () => {
    console.log(`Serveur du fournisseur démarré sur le port ${port}`);
});
