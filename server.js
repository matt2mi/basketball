'use strict';

const Hapi = require('hapi');
const Path = require('path');
const PiServer = require('./pi-server');
const piServer = new PiServer();

const scoreboard = [];

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
            handler: (request, h) => {
                return h
                    .response(scoreboard)
                    .code(200);
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/api/addScore/{newScore?}',
        config: {
            id: 'addScore',
            handler: (request, h) => {
                if(request.params.newScore) {
                    scoreboard.push({username: 'yop', points: request.params.newScore});
                }
                return h
                    .response(scoreboard)
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