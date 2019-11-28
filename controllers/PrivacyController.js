const privacyModel = require('../models/Privacy');
const profileModel = require('../models/Profile');
const actionsModel = require('../models/Actions');
const _ = require('lodash');

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

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Invalid operation';
                    res.json(responseObject);
                } else {
                    const isBlocked = await privacyModel.isUserBlocked(data);
                    if (isBlocked !== undefined) {
                        responseObject.status = false;
                        responseObject.message = 'User is already blocked';
                        res.json(responseObject);
                    } else {
                        // if the user the blocked user is already a match delete it from the match table
                        const {isMatch} = await actionsModel.isMatch({ConnectedUser: id, RequestedUser: blocked_id});
                        if (isMatch > 0)
                            await actionsModel.unMatchUsers({ConnectedUser: id, RequestedUser: blocked_id});
                        // if the user is already liked delete from the likes table
                        await actionsModel.unLikeUser({ConnectedUser: id, RequestedUser: blocked_id});
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

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Invalid operation';
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

    report : async (req, res) => {
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

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Invalid operation';
                    res.json(responseObject);
                } else {
                    const isBlocked = await privacyModel.isUserBlocked(data);
                    const isBlocker = await privacyModel.isUserBlocker({user_id:blocked_id, blocked_id:id});
                    if (isBlocked !== undefined || isBlocker !== undefined ) {
                        responseObject.status = false;
                        responseObject.message = 'Invalid operation';
                        res.json(responseObject);
                    } else {
                        const {isReported} = await privacyModel.isReported(data);
                        if (isReported > 0) {
                            responseObject.status = false;
                            responseObject.message = 'User is already reported';
                            res.json(responseObject);
                        } else {
                            const response = await privacyModel.report(data);
                            if (response === true) {
                                responseObject.message = 'User has been successfuly reported';
                                res.json(responseObject);
                            }
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

    getBlockedList: async (req, res) => {
        const {id} = req.decodedObject;
        responseObject = {
            status: true,
            blockedList: []
        }

        try {

            // get the users list
            let blockedList = await privacyModel.getBlockedList(id);

            blockedList = 

            responseObject.blockedList = blockedList;
            res.json(responseObject);
            
        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
        }
    },

    getBlockedUserInfo: async (req, res) => {
        const {id} = req.decodedObject;
        const {blocked_id} = req.body;
        const data =  {
            user_id: id,
            blocked_id
        }
        const responseObject = {
            status: true,
        }

        try {
            const result = await profileModel.fetchUserWithId(blocked_id);
            if (result !== undefined) {
                if (blocked_id === id){
                    responseObject.status = false;
                    responseObject.message = 'Invalid operation';
                    res.json(responseObject);
                } else {
                    const isBlocked = await privacyModel.isUserBlocked(data);
                    if (isBlocked !== undefined) {
                        const userInfo = await privacyModel.getBlockedUserInfo(blocked_id);
                        responseObject.userInfo = _.pick(userInfo, ['firstname','lastname', 'username', 'profile_picture']);
                        res.json(responseObject);
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
    }
}