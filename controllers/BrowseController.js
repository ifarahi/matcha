const browseModel = require('../models/Browse');

module.exports = {
    prope: 'hello',

    fetchDefaultProfiles: async (req, res) => {
        const {id} = req.decodedObject;
        const name = 'ismail';
        try {
            const result = await browseModel.fetchProfiles(id);
            res.json(result);
        } catch (error) {
            res.json(error);
        }
    }
}