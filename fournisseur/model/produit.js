const mongoose = require("mongoose");
const Entreprise = require("./entreprise");

const produitSchema = new mongoose.Schema(
  {
    ref: { 
        type: String, 
        required: true
     },
    nom: { 
        type: String, 
        required: true
    },
    quantite: { 
        type: Number, 
        required: true 
    },
    prix: { 
        type: Number, 
        required: true 
    }
  },
  { strict: false }
);

const Produit = mongoose.model("Produit", produitSchema);

module.exports = Produit;
