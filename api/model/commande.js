const mongoose = require('mongoose');
const status = require('./status');

const CommandeSchema = new mongoose.Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    produits: [{
        produit: {
            type: Schema.Types.ObjectId,
            ref: 'Produit',
            required: true
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
});

module.exports = mongoose.model('Commande', CommandeSchema);