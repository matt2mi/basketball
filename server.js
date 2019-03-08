'use strict';

const Hapi = require('hapi');
const Path = require('path');
const PiServer = require('./pi-server');
const piServer = new PiServer();

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
                    .response([
                        {username: 'mimil', points: 1},
                        {username: 'mimil', points: 90},
                        {username: 'mimil', points: 8},
                        {username: 'mimil', points: 100},
                        {username: 'mimil', points: 5},
                        {username: 'mimil', points: 4},
                        {username: 'mimil', points: 120},
                        {username: 'mimil', points: 9},
                        {username: 'mimil', points: 18},
                        {username: 'mimil', points: 110},
                        {username: 'mimil', points: 50},
                        {username: 'mimil', points: 40}
                    ])
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