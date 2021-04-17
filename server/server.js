const express = require('express');
const path = require('path');
const moment = require('moment');
const cors = require('cors');
const enforce = require('express-sslify');

// App
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(enforce.HTTPS({ trustProtoHeader: true }));

const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
});

// SecuroChat bot name
let botName = 'SecuroChat Bot'

// Map users to their room
let users = new Map();

// Map id to username
let id = new Map();

// map rooms to the users inside
let rooms = new Map();

// map id to [username, user room]
let roomsID = new Map();

let codeFound = false;

app.get('/api/:code', (req, res) => {
    if (rooms.has(req.params.code)) {
        codeFound = true;
    }

    if (!rooms.has(req.params.code)) {
        codeFound = false;
    }

    if (codeFound) {
        res.json({ code: req.params.code, users: rooms.get(req.params.code) })
    }

    if (!codeFound) {
        res.json({ code: 'not found' })
    }

})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', (socket) => {

    console.log("made connection")

    socket.on('createRoom', (data) => {
        if (rooms.has(data.code)) {
            socket.emit('roomError')
            console.log('room code already exists.')
        }

        if (!rooms.has(data.code)) {
            if (data.code !== '' && data.user !== '') {
                rooms.set(data.code, [data.user])
                users.set(data.user, data.code);
                socket.join(data.code);
                console.log(rooms, users);
            }
            if (data.code === '' || data.user === '') {
                console.log("Username or room code field is empty. Please input.")
            }
        }

    })

    socket.on('joinRoom', (data) => {
        if (rooms.has(data.code)) {
            let arrayOfUsers = rooms.get(data.code);


            if (arrayOfUsers.includes(data.user)) {
                console.log('user already exists.')
            }

            if (!arrayOfUsers.includes(data.user)) {
                arrayOfUsers.push(data.user);
                rooms.set(data.code, arrayOfUsers);
                socket.join(data.code)
                console.log(rooms);
            }

            if (!users.has(data.user)) {
                users.set(data.user, data.code);
            }
        }

    })

    socket.on('connectUser', (username) => {
        if (users.has(username)) {
            socket.join(users.get(username))
            let userFound = false;

            for (let info of roomsID.values()) {
                if (info[0] === username && info[1] === users.get(username)) {
                    userFound = true;
                }
            }
            id.set(socket.id, username);
            roomsID.set(socket.id, [username, users.get(username)])
            console.log(roomsID)
            let arrayOfUsers = rooms.get(users.get(username));

            if (userFound) {
                // sysAlert is for any aler that the system detects.
                socket.emit('sysMessage', `${botName}: You've rejoined.`)
            }
            else {
                // Welcome user
                // botChat is any sort of message that the bot sends.
                socket.emit('botChat', { sender: botName, message: `Welcome to SecuroChat ${username}! You can chat freely without worrying about privacy :)`, time: moment().format('h:mm a') })
                socket.to(users.get(username)).emit("sysMessage", `${username} has joined the chat.`)
                io.to(users.get(username)).emit('joined', arrayOfUsers)
            }
        };

        // Redirects to home page if user does not have a room.
        if (!users.has(username)) {
            socket.emit('redirect')
        }
    })

    socket.on('disconnect', (reason) => {
        if (id.has(socket.id)) {
            let username = id.get(socket.id)
            let room = users.get(username)
            let userCount = 0;
            let arrayOfUsers = rooms.get(room);
            // let info = roomsID.get(socket.id);
            // If there's multiple id's with the same username then increase the count.
            for (let name of id.values()) {
                if (name === username) {
                    userCount++;
                }
            }

            if (userCount === 1) {
                // Send a message when a user disconnects fully
                socket.emit('redirect', '/')
                socket.leave(users.get(username));
                socket.to(users.get(username)).emit('sysMessage', `${username} has left the chat.`)
                io.to(users.get(username)).emit('left', arrayOfUsers, username)
                users.delete(username);
                if (arrayOfUsers.includes(username)) {
                    let index = arrayOfUsers.indexOf(username)
                    arrayOfUsers.splice(index, 1);
                    console.log("Room once user leaves.", rooms)
                }

                console.log("Users map", users);
            }
            if (arrayOfUsers.length === 0) {
                rooms.delete(room);
                console.log('Deleted room', rooms);
            }
            else {
                console.log(arrayOfUsers);
            }

            id.delete(socket.id);
            console.log(id)
            roomsID.delete(socket.id)
            console.log(roomsID)
        }

    })


    socket.on('message', (data) => {
        let room = users.get(data.sender);
        io.in(room).emit('chat', (data))
        if (data.message === '') {
            socket.emit('inputMessage')
        }
    })
})

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
