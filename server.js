'use strict';

const Hapi = require('hapi');
const Path = require('path');

const Laser = require('./laser-barrier.js');
const laser = new Laser();

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
        path: '/watch',
        handler: (request, h) => {
            laser.startListening();
            return h.response('Watching...').code(200);
        }
    });
    server.route({
        method: 'GET',
        path: '/stop-watch',
        handler: (request, h) => {
            laser.stopListening();
            return h.response('Stop watching...').code(200);
        }
    });

    require('./ws-server');

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();