const Hapi = require('hapi');
const Nes = require('nes');

const port = 3005;

const server = new Hapi.Server({port});

const start = async () => {
    await server.register(Nes);

    server.route({
        method: 'GET',
        path: '/connection',
        config: {
            id: 'connection',
            handler: (request, h) => {
                server.publish('/clutch', { counter: 3 });
                server.publish('/clutch', { counter: 3 });
                return {msg: 'connected !'};
            }
        }
    });
    server.subscription('/clutch');
    await server.start();

    console.log('ws server started at', port);
};

start();