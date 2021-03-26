const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');


// App setup
const app = express();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);


io.on('connection', socket => {
    console.log(`Made connection successfully. ${socket.id}`);
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`))