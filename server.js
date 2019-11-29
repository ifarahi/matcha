const express = require('express');
const app = require('express')();
const router = require('./routes');
const cors = require('cors');

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const socketHandler = require('./helpers/socketHandler');

app.use(cors());// Enables cors ( cross origin resources sharing )
app.use(express.static('public')); // serves static assets 
app.use(express.json()); // parse the body wich is contain a json object then pass controll the the router
app.use(router); // all requests will be hanlled by the router

app.use((err, req, res, next) => {
    res.io = io;
    res.status(400).json({
        status: false,
        message: err.message
    });
});

port = process.env.PORT || 3000; // if there any port number has been exported in the env will be used if not 3000 is the default

io.on('connection', function( socket ){
    socketHandler( io, socket );
});



http.listen(port, () => { console.log(`listening on port ${port} ...`) });
