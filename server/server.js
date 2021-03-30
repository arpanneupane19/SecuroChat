const express = require('express');
const path = require('path');
const app = express();
const httpServer = require('http').createServer(app);
var cors = require('cors');
app.use(cors());
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

let codeFound = false;
app.get('/:code', (req, res) => {
    if (rooms.has(req.params.code)) {
        codeFound = true;
    }

    if (!rooms.has(req.params.code)) {
        codeFound = false;
    }

    if (codeFound) {
        res.json({ code: req.params.code })
    }

    if (!codeFound) {
        res.json({ code: 'not found' })
    }
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


    socket.on('joinRoom', (data) => {
        if (rooms.has(data.code)) {
            let arrayOfUsers = rooms.get(data.code);


            if (arrayOfUsers.includes(data.user)) {
                socket.emit('redirect', 'create.html')
            }

            if (!arrayOfUsers.includes(data.user)) {
                arrayOfUsers.push(data.user);
                rooms.set(data.code, arrayOfUsers);
                console.log(rooms);
            }

            if (!users.has(data.user)) {
                users.set(data.user, data.code);
            }

            socket.join(data.code)
            socket.emit('redirect', `/${data.code}`)
        }

        if (!rooms.has(data.code)) {
            socket.emit('redirect', 'create.html')
        }

        console.log(`${data.user} is trying to join room ${data.code}`)
    })

    socket.on('connectUser', (username) => {
        if (users.has(username)) {
            socket.join(users.get(username))
            let userFound = false;
            for (let name of id.values()) {
                if (name === username) {
                    userFound = true;
                }
            }
            id.set(socket.id, username);

            if (userFound) {
                socket.emit('botMessage', `${botName}: You've rejoined.`)
            }
            else {
                // Welcome user
                socket.emit('botMessage', `${botName}: Hello, welcome to SecuroChat!`)
                socket.to(users.get(username)).emit("botMessage", `${username} has joined the chat.`)
            }
        };

        // Redirects to home page if user does not have a room.
        if (!users.has(username)) {
            socket.emit('redirect', '/create')

        }
        if (username === null) {
            socket.emit('redirect', '/join')
        }
    })

    socket.on('message', (data) => {
        console.log(`${data.sender} sent message: ${data.message} at ${data.time}`)
    })
})

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
