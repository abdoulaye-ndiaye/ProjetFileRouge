const express = require('express');

module.exports = {
    creatEntreprise: async (req, res) => {
        try {
            const { nom, adresse, telephone, email, type } = req.body;
            const Verifemail = await Entreprise.findOne({ email: email }).exec();
            if (!Verifemail) {
                const Entreprise = await User.create({ nom : nom, adresse : adresse, telephone : telephone, email : email, type : type})
                .then((Entreprise) => {
                    res.status(201).send(Entreprise);
                })
                .catch((error) => {
                    res.status(400).send('Erreur lors de la création de l\'entreprise');
                });
            }
            else {
                res.status(400).send('Email déjà utilisé');
            }
        }
        catch (error) {
            res.status(500).send(error);
        }
    },
    updateEntreprise: async (req, res) => {
        try {
            const { nom, adresse, telephone, email, role } = req.body;
            const Entreprise = await User.findOneAndUpdate({ email: email }, { nom : nom, adresse : adresse, telephone : telephone, email : email, type : type})
            .then((Entreprise) => {
                res.status(201).send(Entreprise);
            })
            .catch((error) => {
                res.status(400).send(error);
            }, { new: true });
        }
        catch (error) {
            res.status(500).send(error);
        }
    },
}
