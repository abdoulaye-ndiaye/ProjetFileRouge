
exports.receiveWebhook = async (req, res) => {
    try {
      // Récupérer les données envoyées dans le corps de la requête (req.body)
      const { eventType, data } = req.body;
  
      // Par exemple, si le webhook concerne une mise à jour de stock :
      if (eventType === 'stock_update') {
        const { refArticle, quantite } = data;
        console.log(`Accuser de reception de commande pour l'article ${refArticle}, quantité: ${quantite}`);
  
        // Mettre à jour le stock dans la base de données
        const produit = await Produit.findOne({ ref: refArticle });
        if (produit) {
          produit.quantite += quantite;
          await produit.save();
          console.log(`Stock mis à jour pour ${refArticle}`);
        } else {
          console.error('Article non trouvé');
        }
        }
  
      // Retourner une réponse 200 pour confirmer la réception du webhook
      res.status(200).send('Webhook reçu et traité avec succès');
    } catch (err) {
      console.error('Erreur lors du traitement du webhook:', err);
      res.status(500).send('Erreur serveur lors du traitement du webhook');
    }
  };
  