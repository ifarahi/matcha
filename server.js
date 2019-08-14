const express = require('express');
const app = express();
const config = require('config');
const router = require('./routes');

app.use(router);

PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`listening on port ${PORT} ...`) });
