const mongoose = require('mongoose');
const status = require('./status');
const Entreprise = require("./entreprise");
const Produit = require("./produit")

const CommandeSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: Entreprise 
    },
    produits: [{
        refArticle: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: Produit 
        },
        quantiteCommande: {
            type: Number,
            required: true
        },
        quantitelivre: {
            type: Number,
            required: false
        }
    }],
    dateCommande: {
        type: Date,
        default: Date.now
    },
    statut: {
        type: String,
        enum : Object.values(status),
        default: status.EN_ATTENTE
    }
},
{ strict: false }
);
const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;