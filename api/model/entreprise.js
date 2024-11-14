const mongoose = require('mongoose');
const Type = require('./type');

const EntrepriseSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    adresse: {
        type: String,
        required: true,
        trim: true
    },
    telephone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type : {
        type: String, 
        enum: Object.values(Type), 
        default: Type.FOURNISSEUR
    }
}, {
    timestamps: true
});

const Entreprise = mongoose.model('Entreprise', EntrepriseSchema);

module.exports = Entreprise;