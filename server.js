// On importe le module 'http' de Node.js.
// Ce module permet de créer un serveur HTTP (HyperText Transfer Protocol),
// qui va écouter des requêtes web (comme celles envoyées par un navigateur).
const http = require('http');

// On importe notre application Express, qui est définie dans un autre fichier (app.js).
// C'est cette application qui définira comment répondre aux requêtes HTTP.
const app = require('./app');

// On définit le port sur lequel notre serveur va écouter les requêtes.
// - 'process.env.PORT' permet d'utiliser une variable d'environnement (souvent utilisée en production).
// - '3000' est la valeur par défaut si aucune variable d'environnement n'est définie.
app.set('port', process.env.PORT || 3000);

// On crée le serveur HTTP en utilisant notre application Express comme gestionnaire des requêtes.
// Cela signifie que quand une requête arrive, Express s'en occupe.
const server = http.createServer(app);

// Le serveur commence à écouter sur le port défini (environnement ou 3000).
// Cela signifie qu'il est prêt à recevoir des connexions sur ce port.
server.listen(process.env.PORT || 3000);