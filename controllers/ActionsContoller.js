const actionsModel = require('../models/Actions');
const privacyModel = require('../models/Privacy');
const profileModel = require('../models/Profile');

module.exports = {
    likeUser: async (req, res) => {
        const {id:ConnectedUser} = req.decodedObject;
        const {user_id:RequestedUser} = req.body;
        const data = {
            ConnectedUser,
            RequestedUser
        }
        responseObject = {
            status: true
        }

        try {

            // check if the given user is even exists
            const userExists = await profileModel.fetchUserWithId(RequestedUser);
            if (userExists === undefined) {
                responseObject.status = false;
                responseObject.message = 'Bad request user does not exist';
                res.json(responseObject);
                return;
            }
            // check if the given user is already a match
            const {isMatch} = await actionsModel.isMatch(data);
            if (isMatch > 0) {
                responseObject.status = false;
                responseObject.message = 'User is alreay a match';
                res.json(responseObject);
                return;
            }
            // check if the user has been blocked
            const isBlocked = await privacyModel.isUserBlocked({user_id:ConnectedUser,blocked_id:RequestedUser});
            if (isBlocked !== undefined) {
                responseObject.status = false;
                responseObject.message = 'You need to ubblock the given user before to be able to like him/her';
                res.json(responseObject);
                return;
            }
            // check if the user is blocked the connected user
            const isBlocker = await privacyModel.isUserBlocker({user_id:RequestedUser,blocked_id:ConnectedUser});
            if (isBlocked !== undefined) {
                responseObject.status = false;
                responseObject.message = 'Bad request you cant perform this action';
                res.json(responseObject);
                return;
            }
            // check if the user is already on the likes list
            const {isLike} = await actionsModel.isLike(data);
            if (isLike > 0) {
                responseObject.status = false;
                responseObject.message = 'User is already on your likes list';
                res.json(responseObject);
                return;
            }

            // if the user unliked him self
            if (ConnectedUser === RequestedUser) {
                responseObject.status = false;
                responseObject.message = 'Unvalid operation';
                res.json(responseObject);
                return;
            }


            await actionsModel.likeUser(data);
            responseObject.message = 'Action has been successfuly performed';
            res.json(responseObject);

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    unLikeUser: async (req, res) => {
        const {id:ConnectedUser} = req.decodedObject;
        const {user_id:RequestedUser} = req.body;
        responseObject = {
            status: true
        }

        try {

            // if the user unliked him self
            if (ConnectedUser === RequestedUser) {
                responseObject.status = false;
                responseObject.message = 'Unvalid operation';
                res.json(responseObject);
                return;
            }
            // check if the given user is even exists
            const userExists = await profileModel.fetchUserWithId(RequestedUser);
            if (userExists === undefined) {
                responseObject.status = false;
                responseObject.message = 'Bad request user does not exist';
                res.json(responseObject);
                return;
            }
            // check if the user is not on the likes list
            const {isLike} = await actionsModel.isLike(data);
            if (isLike === 0) {
                responseObject.status = false;
                responseObject.message = 'User is not on your likes list';
                res.json(responseObject);
                return;
            }

            const result = await actionsModel.unLikeUser(data);
            responseObject.message = 'Action has been successfuly performed';
            res.json(responseObject);

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    }
}