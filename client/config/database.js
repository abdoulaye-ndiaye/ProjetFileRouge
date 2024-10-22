require('dotenv').config();
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_DB_URL_LOCAL;
//const mongoDB = process.env.MONGO_DB_URL;

mongoose
  .set('strictQuery', true)
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error.message);
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;