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

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('createRoom', (data) => {
        console.log(`${data.user} is trying to join room ${data.code}`)
    })
})

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
