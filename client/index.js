const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
//const cors = require('cors');
require('dotenv').config();

const app = express();
const mongoose = require('./config/database.js');

const port = process.env.PORT || 3001;

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));

//calling controllers
const api = require("./routes/routes")
  
app.use('/', api)

// Middleware de gestion des erreurs
app.use(errorHandler);
  
app.get('/', (req, res) => {
    res.json({ "message": "Bienvenue dans l'API de projet File Rouge" });
})
// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`API Fournisseur démarrée sur le port ${PORT}`);
});
