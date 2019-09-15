const express = require('express');
const app = express();
const router = require('./routes');
var cors = require('cors');

app.use(cors());

app.use(express.json()); // parse the body wich is contain a json object then pass controll the the router
app.use(router); // all requests will be hanlled by the router

port = process.env.PORT || 3000; // if there any port number has been exported in the env will be used if not 3000 is the default
app.listen(port, () => { console.log(`listening on port ${port} ...`) });
