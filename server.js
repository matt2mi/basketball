'use strict';

const Hapi = require('hapi');
const Path = require('path');
const PiServer = require('./pi-server');
const piServer = new PiServer();

require('dotenv').config();
const admin = require("firebase-admin");
// get credentials from params > service accounts
admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.TYPE,
        "project_id": process.env.PJ_ID,
        "private_key_id": process.env.PV_KEY_ID,
        "private_key": process.env.PV_KEY,
        "client_email": process.env.CLI_MAIL,
        "client_id": process.env.CLI_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.CERT_URL,
        "client_x509_cert_url": process.env.CLI_CERT_URL
    }),
    databaseURL: process.env.BDD_URL
});
const db = admin.database();

// Create a server with a host and port
const server = Hapi.server({
    //host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'build')
        }
    }
});

// Start the server
const init = async () => {
    await server.register(require('inert'));

    // Add the route
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './',
                index: true
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/matt2mi/basketball/{file*}',
        handler: {
            directory: {
                path: '.'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/api/scoreboard',
        config: {
            id: 'scoreboard',
            handler: async (request, h) => {
                let scores = [];
                await db.ref('scores').once('value', (snapshot) => {
                    const scoresDB = snapshot.val();
                    scores = Object
                        .keys(scoresDB)
                        .map(key => ({
                            id: key,
                            username: scoresDB[key].username,
                            score: scoresDB[key].score,
                        }));
                });
                return h
                    .response(scores)
                    .code(200);
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/api/addScore/{pseudo}/{score}',
        config: {
            id: 'addScore',
            handler: (request, h) => {
                const newObject = db.ref('scores').push();
                newObject
                    .set({
                        username: request.params.pseudo,
                        score: request.params.score
                    })
                    .then(() => {
                        console.log('end');
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                return h
                    .response('sauvegardé !')
                    .code(200);
            }
        }
    });

    await piServer.start();

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('killing server');
    piServer.killProcesses();

    process.exit(1);
});

init();