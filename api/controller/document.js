const Document = require('../model/document');

module.exports = {
    create: async (req, res) => {
        const { originalname, path }= req.file;
        const { type, statut, dateCreation, entreprise} = req.body;
        if (!originalname) {
            const error = new Error("SVP veuillez uploader un fichier");
            error.httpStatusCode = 400;
            res.send("error");
          } else {
        // creer document
        const document = await Document.create({ url : path, type : type, statut : statut, dateCreation : dateCreation, entreprise : entreprise})
        .then(() => {
            res.status(200).send({success: true, code: 1, message: "Document créé avec succès "});
          })
        .catch((err) => {
            res.send(err);
        });
        }
    },
    findAll: async (req, res) => {
        try {
            const documents = await Document.find();
            res.status(200).send(documents);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    findOne: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            if (!document) {
                return res.status(404).send('Document not found');
            }
            res.status(200).send(document);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    update: async (req, res) => {
        try {
            const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!document) {
                return res.status(404).send('Document not found');
            }
            res.status(200).send(document);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    delete: async (req, res) => {
        try {
            const document = await Document.findByIdAndDelete(req.params.id);
            if (!document) {
                return res.status(404).send('Document not found');
            }
            res.status(204).send();
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // Télécharger le document
    downloadDocument: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            if (!document) {
                return res.status(404).send({ message: "Document non trouvé" });
            }
            res.download(document.url);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // archiver un document
    archive: async (req, res) => {
        try {
            const document = await Document.findByIdAndUpdate(req.params.id, {archivable: true}, { new: true });
            if (!document) {
                return res.status(404).send('Document not found');
            }
            res.status(200).send(document);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // désarchiver un document
    unarchive: async (req, res) => {
        try {
            const document = await Document.findByIdAndUpdate(req.params.id, {archivable: false}, { new: true });
            if (!document) {
                return res.status(404).send('Document not found');
            }
            res.status(200).send(document);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
};