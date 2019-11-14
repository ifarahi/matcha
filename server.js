const express = require('express');
const app = express();
const router = require('./routes');
const cors = require('cors');
// const io = require('socket.io')( app );

 
app.use(cors());// Enables cors ( cross origin resources sharing )
app.use(express.static('public')); // serves static assets 
app.use(express.json()); // parse the body wich is contain a json object then pass controll the the router
app.use(router); // all requests will be hanlled by the router

// what is this and also should we just remove serve static assets?
app.use((err, req, res, next) => {
    res.status(400).json({
        message: err.message
    });
});

port = process.env.PORT || 3000; // if there any port number has been exported in the env will be used if not 3000 is the default

// console.log( app )
// io.on('connection', function(socket){
//     console.log('a user connected');
// });

app.listen(port, () => { console.log(`listening on port ${port} ...`) });
