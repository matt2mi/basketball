'use strict';

const Hapi = require('hapi');
const Path = require('path');
const FlowingLeds = require('./flowing-leds.js');
let flowingLeds = new FlowingLeds();

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
        path: '/start',
        handler: (request, h) => {
            console.log('startFlowing');
            flowingLeds.start();
            return 'Party started !';
        }
    });
    server.route({
        method: 'GET',
        path: '/stop',
        handler: (request, h) => {
            console.log('stopFlowing');
            flowingLeds.stop();
            return 'Party stopped !';
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