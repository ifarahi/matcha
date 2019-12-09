const express = require('express');
const app = require('express')();
const router = require('./routes');
const cors = require('cors');

const socketHelpers = require('./helpers/socketHelpers');
const socketHandler = require('./helpers/socketHandler');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    serveClient: false,
    pingInterval: 100000,
    pingTimeout: 50000,
    cookie: false
});

app.set('io', io);
app.set('socketHelpers', socketHelpers);


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
    // console.log(`Connected user: ${socket.id}`);
    socketHandler( io, socket );
    // io.to( socket.id ).emit( "getFriendsList", 'tesrrrrt')
    // io.emit('getFriendsList', 'test');
    // socket.emit('getFriendsList', 'broadcasted response');
    // socket.on( 'disconnect', function () {
    //     console.log('user has disconnected' + this.id);
    // });
});


// io.on('connection', function(socket){
//     console.log('a user connected');
//     io.to( socket.id ).emit('test', 'this is a test');
// });


http.listen(port, () => { console.log(`listening on port ${port} ...`) });



// CREATE TABLE chat (
//     id int PRIMARY KEY AUTO_INCREMENT,
//     user1 int,
//     user2 int,
//     FOREIGN KEY (user1) REFERENCES users(id), 
//     FOREIGN KEY (user2) REFERENCES users(id)
// )


// CREATE TABLE messages(
//     id int PRIMARY KEY AUTO_INCREMENT,
//     chat_id int, 
//     targetId int,
//     senderId int,
//     message VARCHAR(500),
//     FOREIGN KEY(chat_id) REFERENCES chat(id),
//     deleted int DEFAULT -1
// )


// CREATE TABLE notification (
//     id int PRIMARY KEY AUTO_INCREMENT,
//     user_id int,
//     target_id int,
//     type VARCHAR(50),
//     seen int DEFAULT 1,
//     `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (target_id) REFERENCES users(id) 
//  )