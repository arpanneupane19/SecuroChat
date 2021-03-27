const express = require('express');
const path = require('path');
const app = express();
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// SecuroChat bot name
let botName = 'SecuroChat Bot'

// Map users to their room
let users = new Map();

// Map id to username
let id = new Map();

// map rooms to the users inside
let rooms = new Map();


app.get('/:code', (req, res) => {
    console.log(req.params.code)
})

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('createRoom', (data) => {
        if (rooms.has(data.code)) {
            console.log('Room code already exists. Cannot create.')
            socket.emit('redirect', '/join')
        }

        if (!rooms.has(data.code)) {
            rooms.set(data.code, [data.user])
            users.set(data.user, data.code);
            socket.join(data.code);
            console.log(rooms, users);
            socket.emit('redirect', `${data.code}`)
        }

        console.log(`${data.user} is trying to join room ${data.code}`)
    })

    // socket.on('message', (data) => {
    //     console.log(`${data.sender}: ${data.message}`)
    // })
})

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
