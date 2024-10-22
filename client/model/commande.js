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
        quantite: {
            type: Number,
            required: true
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