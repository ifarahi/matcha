const   express = require('express');
const   router = express.Router();
const   Users = require('./Users');
const   Profile = require('./Profile');
const   Setting = require('./Setting');
const   Browse = require('./Browse');
const   Privacy = require('./Privacy');
const   Actions = require('./Actions');
const   Chat = require('./Chat');
const   Notification =require('./Notification');
/*
**** This is the router module wich is responsable to pass controll to the right router 
**** ex : any request start with '/users' will be handled with the users, router '/images' will be handled with images router
*/

router.use('/users', Users); // any reqeust contains '/users' will be handled by the user router 
router.use('/profile', Profile);
router.use('/setting', Setting);
router.use('/Browse', Browse);
router.use('/Privacy', Privacy);
router.use('/Actions', Actions);
router.use('/Chat', Chat);
router.use('/notification', Notification)

// router.use('/', ( req, res ) => {
//     console.log('test')
//     res.io.on( 'connection', ( socket ) => {
//         console.log( `A user has been connected ${ socket.conn.id }` );
//     })
// })

module.exports = router;
