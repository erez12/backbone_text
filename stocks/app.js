"use strict";

const express = require('express');
const path = require('path');
const data = require('./data');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// public folder
app.use(express.static(path.join(__dirname) + '/public'));

// Socket
io.on('connection', function(socket) {
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('initial_connect', (msg, ackFunction) => {
        data.getAll().then((stocksData) => {
            ackFunction(stocksData)
        });
    });
});

setInterval(() => {
    data.updateStockData().then((newData) => io.emit('new_data', newData))
}, 500);

http.listen(process.env.PORT || 3000, () => console.log('listening on *:3000'));
