const privacyModel = require('../models/Privacy');
const profileModel = require('../models/Profile');

module.exports = {
    blockUser: async (req, res) => {
        const {id} = req.decodedObject;
        const {blocked_id} = req.body;
        const data =  {
            user_id: id,
            blocked_id
        }
        const responseObject = {
            status: true,
            message: ''
        }

        // if the user profile not completed cannot update this information the request should be end
        try {
            const {is_first_visit} = await profileModel.fetchUserWithId(id);
            if (is_first_visit !== 0){
                responseObject.status = false;
                responseObject.message = 'You need to complete your profile';
                res.json(responseObject);
                return;
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = 'error';
            res.json(responseObject);
            return ;
        }

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Unvalid operation';
                    res.json(responseObject);
                } else {
                    const isBlocked = await privacyModel.isUserBlocked(data);
                    if (isBlocked !== undefined) {
                        responseObject.status = false;
                        responseObject.message = 'User is already blocked';
                        res.json(responseObject);
                    } else {
                        const response = await privacyModel.blockUser(data);
                        if (response === true) {
                            responseObject.message = 'User has been successfuly blocked';
                            res.json(responseObject);
                        }
                    }
                }
            } else {
                responseObject.status = false;
                responseObject.message = 'User does not exist';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
        }
    },

    unblockUser: async (req, res) => {
        const {id} = req.decodedObject;
        const {blocked_id} = req.body;
        const data =  {
            user_id: id,
            blocked_id
        }
        const responseObject = {
            status: true,
            message: ''
        }
        
        // if the user profile not completed cannot update this information the request should be end
        try {
            const {is_first_visit} = await profileModel.fetchUserWithId(id);
            if (is_first_visit !== 0){
                responseObject.status = false;
                responseObject.message = 'You need to complete your profile';
                res.json(responseObject);
                return;
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = 'error';
            res.json(responseObject);
            return ;
        }

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Unvalid operation';
                    res.json(responseObject);
                } else {
                    const isBlocked = await privacyModel.isUserBlocked(data);
                    if (isBlocked !== undefined) {
                        const response = await privacyModel.unblockUser(data);
                        if (response === true) {
                            responseObject.message = 'User has been successfuly unblocked';
                            res.json(responseObject);
                        }
                    } else {
                        responseObject.status = false;
                        responseObject.message = 'User is not on your blocked list';
                        res.json(responseObject);
                    }
                }
            } else {
                responseObject.status = false;
                responseObject.message = 'User does not exist';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
        }
    },
}