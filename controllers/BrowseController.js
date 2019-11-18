const browseModel = require('../models/Browse');

module.exports = {
    fetchDefaultProfiles: (req, res) => {
        res.json(req.decodedObject);
    }
}