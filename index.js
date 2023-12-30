'use strict';

const Hapi = require('@hapi/hapi');
const pg = require('pg');

const { Client } = pg;

const config = {
    host: '127.0.0.1',
    port: 5432,
    database: 'devops',
    user: 'devops',
    password: 'password'
}
const db = new Client(config)


const init = async () => {
    await db.connect(); 

    const server = Hapi.server(
        {
            port: 3000,
            host: '0.0.0.0'
        }
    ); 

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => { 
            const res = await db.query('SELECT * FROM people');
            return h.response(res.rows);
        }
    }); 

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    db.close();
    process.exit(1);
});

init();



