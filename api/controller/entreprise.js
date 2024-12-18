const { get } = require('mongoose');
const Entreprise = require('../model/entreprise')

module.exports = {
    createEntreprise: async (req, res) => {
        try {
            const { nom, adresse, telephone, email, type } = req.body;
            console.log(req.body);
    
            // Vérification si l'email existe déjà dans la base de données
            const verifEmail = await Entreprise.findOne({ email }).exec(); // Utilisation de `findOne` pour vérifier si l'email existe
            console.log(verifEmail); // Affiche le résultat de la recherche
    
            if (verifEmail) {  // Si l'email existe déjà, retourne une erreur
                return res.status(400).send('Email déjà utilisé');
            }
    
            // Création de l'entreprise avec les données envoyées dans la requête
            const entreprise = new Entreprise({
                nom: nom,
                adresse: adresse,
                telephone: telephone,
                email: email,
                type: type ,  // Utilisation de la valeur par défaut si 'type' est vide
            });
    
            // Sauvegarde de l'entreprise dans la base de données
            await entreprise.save();
            res.status(201).send(entreprise);  // Réponse avec l'entreprise créée
        } catch (error) {
            console.error(error);  // Affiche l'erreur pour le debug
            res.status(500).send('Erreur interne du serveur');
        }
    },
    
    updateEntreprise: async (req, res) => {
        try {
            const { nom, adresse, telephone, email, type } = req.body;
    
            // Vérification si l'entreprise avec cet email existe
            const entreprise = await Entreprise.findOne({ email: email });
            
            if (!entreprise) {
                return res.status(404).send('Entreprise non trouvée');
            }
    
            // Mise à jour de l'entreprise avec les nouvelles données
            const updatedEntreprise = await Entreprise.findOneAndUpdate(
                { email: email }, // Recherche de l'entreprise par son email
                { nom, adresse, telephone, type }, // Données à mettre à jour
                { new: true } // Option pour retourner le document mis à jour
            );
    
            res.status(200).send(updatedEntreprise); // Retourne l'entreprise mise à jour
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur interne du serveur');
        }
    },
    getAll: async (req, res) => {
        try {
            const entreprises = await Entreprise.find();
            res.status(200).send(entreprises);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur interne du serveur');
        }
    },
    getById: async (req, res) => {
        try {
            const entreprise = await Entreprise.findById(req.params.id);
            res.status(200).send(entreprise);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur interne du serveur');
        }
    },
    deleteEntreprise: async (req, res) => {
        try {
            const entreprise = await Entreprise.findByIdAndDelete(req.params.id);
            if (!entreprise) {
                return res.status(404).send('Entreprise non trouvée');
            }
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur interne du serveur');
        }
    }
    
}
