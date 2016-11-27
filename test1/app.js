const express = require('express');
const path = require('path');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// public folder
app.use(express.static(path.join(__dirname)));

// Socket
io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('client_message', function (from, msg, ackFunction) {
        ackFunction()
    });
});

setInterval(() => {
    io.emit('new_data', {
        data: [{id: 1, value: 123}, {id: 2, value: 456}, {id: 3, value: 789}]
    });
}, 1000 * 5);

http.listen(process.env.PORT || 3000, () => console.log('listening on *:3000'));
