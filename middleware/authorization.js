const browseModel = require('../models/Browse');

module.exports = {
    isProfileCompleted: async (req, res, next) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: false
        }
        // if the user profile not completed cannot update this information the request should be end
        try {
            const {is_first_visit} = await browseModel.fetchUserProfile(id);
            if (is_first_visit !== 0){
                responseObject.message = 'You need to complete your profile';
                res.json(responseObject);
                return;
            } else {
                next();
            }
        } catch (error) {
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
            return ;
        }
    }
 }