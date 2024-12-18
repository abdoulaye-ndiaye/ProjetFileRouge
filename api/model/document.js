const mongoose = require('mongoose');
const TypeDocument = require('./typeDocument');
const StatutDocument = require('./statutDocument');
const Entreprise = require('./entreprise');
const DocumentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(TypeDocument),
        default: TypeDocument.Echancier
    },
    statut: {
        type: String,
        enum: Object.values(StatutDocument),
        default: StatutDocument.EnAttente
    },
    archivable: {
        type: Boolean,
        default: false
    },
    dateCreation: {
        type: String,
        required: true
    },
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Entreprise,
        required: true
    }
}
    , {
        timestamps: true,
        //collection: document
    });

module.exports = mongoose.model('Document', DocumentSchema);