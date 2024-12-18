# ProjetFileRouge# Projet de Microservices Node.js avec Docker et MongoDB

## Description du Projet
Ce projet implémente trois microservices (API, Client, Fournisseur) conteneurisés avec Docker et utilisant MongoDB comme base de données.

## Prérequis
- Docker
- Docker Compose
- Node.js (version 18+)
- npm

## Structure du Projet
```
projet-apis/
│
├── api/
│   ├── config/
│   │   ├── database.js
│   ├── controller/
│   │   ├── tous les services de chaque tables
│   ├── model/
│   │   ├── tout les tables de la base
│   ├── routes/
│   │   ├── routes.js tous les accés de l'api
│   ├── utils/
│   │   ├── webhook.js tous les fonctions de notification
│   ├── .env pour les config de l'api
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
│
├── client/
│   ├── .env pour les config de l'api
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
│
├── fournisseur/
│   ├── .env pour les config de l'api
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

## Installation

### 1. Clonage du Repository
```bash
git clone https://github.com/abdoulaye-ndiaye/ProjetFileRouge.git
cd projetFileRouge
```

### 2. Installation des Dépendances
```bash
# Entrer Dans chaque dossier (api, client, fournisseur) et faire
npm install
```

### 3. Configuration de l'environnement
Créez un fichier `.env` dans chaque dossier avec les configurations suivantes :

#### Dans `api/.env`
```
MONGO_DB_URL=mongodb://mongodb:27017/projet-fileRouge
PORT_FOURNISSEUR=3000
PORT=3001
PORT_CLIENT=3002
JWT_SECRET=VotreSecretJWT
```

#### Dans `client/.env`
```
PORT_CLIENT=3002
```

#### Dans `fournisseur/.env`
```
PORT_FOURNISSEUR=3000
```
## Commandes Utiles Docker pour demarrer le projet
Dans ce cas, je vais vous guider pour installer Docker Compose. L'installation varie selon votre système d'exploitation :

### Pour Linux :
```bash
# Mise à jour des packages
sudo apt-get update

# Installation de Docker Compose
sudo apt-get install docker-compose
```

### Pour macOS :
1. Si vous avez Docker Desktop, Docker Compose est déjà inclus
2. Sinon, installez-le via Homebrew :
```bash
brew install docker-compose
```

### Pour Windows :
1. Docker Desktop pour Windows inclut Docker Compose automatiquement
2. Téléchargez depuis le site officiel de Docker

### Vérification de l'installation :
```bash
docker-compose --version
```

Si vous ne voulez pas utiliser Docker Compose, vous pouvez aussi créer et gérer vos conteneurs manuellement avec Docker :

## Commandes Utiles Docker:
- creer les conteneurs: `docker-compose up --build`
- Arrêter les conteneurs actuels: `docker-compose down`
- Reconstruire et redémarrer un seul service: `docker-compose up --build api`
# Supprimer et recréer un conteneur
`docker-compose rm -f api`
`docker-compose up -d api`

## Services

### API Principale

#### Description
Cette API permet la gestion des entreprises, des produits et des commandes via des routes RESTful. Elle utilise **Express.js** comme framework backend et **MongoDB** comme base de données.

---

#### Configuration
- **Port** : `3001`
- **Base de données** : MongoDB

---

#### Fonctionnalités principales

##### 1. Gestion des entreprises
###### Routes
- **Créer une entreprise** :
  - **Méthode** : `POST`
  - **URL** : `/entreprise`
- **Mettre à jour une entreprise** :
  - **Méthode** : `PUT`
  - **URL** : `/entreprise`

---

##### 2. Gestion des produits
###### Routes
- **Récupérer tous les produits** :
  - **Méthode** : `GET`
  - **URL** : `/produit`
- **Récupérer un produit par ID** :
  - **Méthode** : `GET`
  - **URL** : `/produit/:id`
- **Créer un nouveau produit** :
  - **Méthode** : `POST`
  - **URL** : `/produit`
- **Mettre à jour un produit** :
  - **Méthode** : `PUT`
  - **URL** : `/update-produit/:id`
- **Supprimer un produit** :
  - **Méthode** : `DELETE`
  - **URL** : `/delete-produit/:id`
- **Récupérer les produits d'une entreprise** :
  - **Méthode** : `GET`
  - **URL** : `/produit-entreprise/:entrepriseId`
- **Récupérer les produits actifs** :
  - **Méthode** : `GET`
  - **URL** : `/produit-actifs`

---

##### 3. Gestion des commandes
###### Routes
- **Envoyer une commande** :
  - **Méthode** : `POST`
  - **URL** : `/commande`
- **Modifier une commande fournisseur** :
  - **Méthode** : `PUT`
  - **URL** : `/commande-fournisseur/:id`
- **Modifier une commande client** :
  - **Méthode** : `PUT`
  - **URL** : `/commande-client/:id`
- **Récupérer toutes les commandes** :
  - **Méthode** : `GET`
  - **URL** : `/commande`
- **Récupérer une commande par ID** :
  - **Méthode** : `GET`
  - **URL** : `/commande/:id`
- **Supprimer une commande** :
  - **Méthode** : `DELETE`
  - **URL** : `/commande/:id`
- **Récupérer les commandes d'un client** :
  - **Méthode** : `GET`
  - **URL** : `/commandes-client/:clientId`



### Service Fournisseur
#### Configuration
- **Port** : `3000`

#### Routes
- **Notification de produit créé** :
  - **Méthode** : `POST`
  - **URL** : `/produit-cree`
- **Notification de produit mis à jour** :
  - **Méthode** : `POST`
  - **URL** : `/produit-mis-a-jour`
- **Notification de produit supprimé** :
  - **Méthode** : `POST`
  - **URL** : `/produit-supprime`
- **Notification de produit insuffisant** :
  - **Méthode** : `POST`
  - **URL** : `/produit-insuffisant`
- **Notification de commande modifiée par le client** :
  - **Méthode** : `POST`
  - **URL** : `/commande-modifiee-client`
- **Notification de commande modifiée par le fournisseur** :
  - **Méthode** : `POST`
  - **URL** : `/commande-modifiee-fournisseur`

### Service Client
#### Configuration
- **Port** : `3002`

#### Routes
- **Notification de création de produit** :
  - **Méthode** : `POST`
  - **URL** : `/produit-cree`
- **Notification de mise à jour de produit** :
  - **Méthode** : `POST`
  - **URL** : `/produit-mis-a-jour`
- **Notification de suppression de produit** :
  - **Méthode** : `POST`
  - **URL** : `/produit-supprime`
- **Notification de commande modifiée par le client** :
  - **Méthode** : `POST`
  - **URL** : `/commande-modifiee-client`
- **Notification de commande modifiée par le fournisseur** :
  - **Méthode** : `POST`
  - **URL** : `/commande-modifiee-fournisseur`


## Dépannage

### Problèmes Courants
- Assurez-vous que les ports ne sont pas déjà utilisés
- Vérifiez la connexion réseau entre les conteneurs
- Consultez les logs Docker en cas d'erreur

## Technologies Utilisées
- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose

## Contribution
[Instructions de contribution, si applicable]

## Licence
Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).

---

### Notes Importantes
- Assurez-vous d'avoir Docker et Docker Compose installés
- Les versions des dépendances peuvent nécessiter des ajustements
- Testez thoroughly avant le déploiement

## Auteur
**Abdoulaye Ndiaye**