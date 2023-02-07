const http = require('http');

const app = require('./app');
require('dotenv').config({ path: __dirname + '/./../../.env' })

const server = http.createServer(app);

// socket io connection
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

global.io = io;


// database configuration
const db = require('./db/db');


// server configurations
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})