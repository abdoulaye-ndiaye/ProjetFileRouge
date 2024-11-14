const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
//const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const mongoose = require('./config/database.js');

const port = process.env.PORT || 3001;

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
//   });

//   var allowedOrigins = ['http://localhost:4200',];

//   app.use(cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin 
//       // (like mobile apps or curl requests)
//       console.log(`Origin : ${origin}`);
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg = 'The CORS policy for this site does not ' +
//           'allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }
//   }));
  
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  //calling controllers
  const api = require("./routes/routes")
  
  app.use('/', api)

  
  app.get('/', (req, res) => {
    res.json({ "message": "Bienvenue dans l'API de projet File Rouge" });
  })
  
  // Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
  });