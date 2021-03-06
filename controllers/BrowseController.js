const browseModel = require('../models/Browse');
const privacyModel = require('../models/Privacy');
const profileModel = require('../models/Profile');
const actionsModel = require('../models/Actions');
const userModel = require('../models/Users');
const tagsModel = require('../models/Tags');
const browseHelper = require('../helpers/browseHelper');
const moment = require('moment');
const fetch = require('node-fetch');

const notificationController = require('./NotificationController');

module.exports = {
    fetchProfiles: async (req, res) => {
        const {id} = req.decodedObject;
        const filter = req.body.filter;
        const responseObject = {
            status: true,
        }

        try {
            let profiles = await browseModel.fetchProfiles(id);
            const blocked = await privacyModel.getBlockedList(id);
            const blockers = await privacyModel.getBlockersList(id);
            const latestUserProfile = await browseModel.fetchUserProfile(id);

            // get user likes list
            const userLikes = await browseModel.fetchProfileLikes(id);

            // get connected user tags
            latestUserProfile.tags = await tagsModel.userGetTags(id);
            latestUserProfile.tags = latestUserProfile.tags.map(elm => elm.name);

            // filter profiles list from blocked profiles
            profiles = await browseHelper.filterBlocked({profiles, blocked});
            
            // filter profiles list from blockers profiles
            profiles = await browseHelper.filterBlockers({profiles, blockers});

            // filter uncompleted profiles
            profiles = await browseHelper.filterUncompletedProfiles(profiles);

            // filter based on sexual preferences
            profiles = await browseHelper.filterSexualPreferences({sexualPreference: latestUserProfile.sexual_preferences, profiles})

            // filter already matched profiles
            profiles = await browseHelper.filterMatchedProfiles({profiles, id});

            profiles = await browseHelper.filterProfileLikes({profiles, id, userLikes});

            // apply given or default filter preferences
            profiles = await browseHelper.applyFilter({profiles, filter, latestUserProfile});

            // sort by distance
            profiles = profiles.sort((a, b) => a.distance - b.distance);

            responseObject.profiles = profiles;
            res.json(responseObject);

        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
        }
    },

    fetchUserProfile: async (req, res) => {
        const io = req.app.get('io');
        const socketHelpers = req.app.get('socketHelpers');

        const { username } = req.body;
        const {id:connected, username:connectedUsername} = req.decodedObject;
        const responseObject = {
            status: true,
        }
        
        try {

            // check if the user is exists
            const userExists = await userModel.usernameExists(username);
            if (userExists < 1) {
                responseObject.status = false;
                responseObject.message = 'User does not exists';
                responseObject.reason = 404;
                res.json(responseObject);

            } else {

                // fetch the user profile
                const userProfile = await browseModel.fetchProfileWithUsername(username);
                const {longitude, latitude, id:requested} = userProfile;
    
                // check if the connected user is already blocked the given user
                const isUserBlocker = await privacyModel.isUserBlocker({user_id: connected, blocked_id: requested});

                // check if the requested user is already blocked the connected user
                const isUserBlocked = await privacyModel.isUserBlocker({user_id: requested, blocked_id: connected});

                // if the user is blocked or blocker end the request with a false status
                if (isUserBlocked !== undefined || isUserBlocker !== undefined){
                    responseObject.status = false;
                    responseObject.message = 'Unauthorized page';
                    responseObject.reason = 401;
                    res.json(responseObject);
                    return;
                }

                // fetch user tags
                userProfile.tags = await tagsModel.userGetTags(userProfile.id);
                // set user tags on array instad of array object
                userProfile.tags = userProfile.tags.map(elm => elm.name);

                if (longitude !== '0' && longitude !== '0') {
                    // fetch user location with the given geoLocation
                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`);
                    const data = await response.json();
                    userProfile.location = data.results[0].formatted_address;
                }
    
                // fetch user images 
                const userImages = await profileModel.getUserImages(requested);
                userProfile.images = userImages.map(elm => elm.image);
    
                // dont save notifications on user requested his profile
                if (username.toLowerCase() !== connectedUsername.toLowerCase()) {
                    // recored the visit history
                    await actionsModel.setAsVisited({visitor: connected, visited: userProfile.id});

                    // await actionsModel.setAsVisited({visitor: connected, visited: userProfile.id});
                    await notificationController.notificationAddNew( connected, userProfile.id, "Visit", io, socketHelpers );
                }
                
                responseObject.userProfile = userProfile;
                res.json(responseObject);
            }

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }

    },

    isLike: async (req, res) => {
        const { user_id } = req.body;
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
        }

        try {
            const {isLike} = await browseModel.isLike({id, user_id});
            if (isLike > 0) {
                responseObject.message = 'User is already on your likes list';
                res.json(responseObject);
            } else {
                responseObject.status = false;
                responseObject.message = 'User is not on your likes list';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    isMatch: async (req, res) => {
        const { user_id } = req.body;
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
        }

        try {
            const {isMatch} = await actionsModel.isMatch({ConnectedUser: id, RequestedUser: user_id});

            if (isMatch > 0) {
                responseObject.message = 'User is a match';
                res.json(responseObject);
            } else {
                responseObject.status = false;
                responseObject.message = 'User is not on your matches list';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    fetchUserMatches: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
            matches: []
        }

        try {

            const matchedProfiles = await browseModel.getMatchedProfiles(id);
            responseObject.matches = matchedProfiles;
            res.json(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    getUserMatches: async ( id ) => {
        const responseObject = {
            status: true,
            matches: []
        }
        try {
            const matchedProfiles = await browseModel.getMatchedProfiles(id);
            responseObject.matches = matchedProfiles;
            return(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            return(responseObject);
        }
    },

    getUserlikes: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
            likes: []
        }

        try {

            const matchedProfiles = await browseModel.getProfilesLikes(id);
            responseObject.likes = matchedProfiles;
            res.json(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    getUserliked: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
            likes: []
        }

        try {

            const matchedProfiles = await browseModel.getProfilesLiked(id);
            responseObject.likes = matchedProfiles;
            res.json(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    getVisitorsHistory: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
        }

        try {
            const profiles = await browseModel.getVisitorsHistory(id);
            if (profiles.length > 0) {
                let profilesWithTime = profiles.map((profile) => {
                    return {
                        ...profile,
                        timeAgo: moment(profile.date, 'YYYYMMDDhhmmss').add(1, 'hours').fromNow(),
                        sortTime: new Date(profile.date).getTime()
                    }
                });
                profilesWithTime = profilesWithTime.sort((a, b) => b.sortTime - a.sortTime);
                responseObject.profiles = profilesWithTime;
                res.json(responseObject)
            } else {
                responseObject.profiles = [];
                res.json(responseObject)
            }

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    getVisitsHistory: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
        }

        try {
            const profiles = await browseModel.getVisitsHistory(id);
            if (profiles.length > 0) {
                let profilesWithTime = profiles.map((profile) => {
                    return {
                        ...profile,
                        timeAgo: moment(profile.date, 'YYYYMMDDhhmmss').add(1, 'hours').fromNow(),
                        sortTime: new Date(profile.date).getTime()
                    }
                });
                profilesWithTime = profilesWithTime.sort((a, b) => b.sortTime - a.sortTime);
                responseObject.profiles = profilesWithTime;
                res.json(responseObject)
            } else {
                responseObject.profiles = [];
                res.json(responseObject)
            }

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    fetchTags: async (req, res) => {
        const responseObject = {
            status: true,
            tags: []
        }

        try {

            const matchedProfiles = await browseModel.fetchTags();
            responseObject.tags = matchedProfiles;
            res.json(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }
    },

    getLastConnection: async (req, res) => {
        const {id} = req.decodedObject;
        const {user_id} = req.body;
        const responseObject = {
            status: true,
        }

        try {
    
            if ( user_id || user_id === 0 ) {
                // check if the connected user is already blocked the given user
                const isUserBlocker = await privacyModel.isUserBlocker({user_id: id, blocked_id: user_id});
    
                // check if the requested user is already blocked the connected user
                const isUserBlocked = await privacyModel.isUserBlocker({user_id,  blocked_id: id});
    
                // if the user is blocked or blocker end the request with a false status
                if (isUserBlocked !== undefined || isUserBlocker !== undefined){
                    responseObject.status = false;
                    responseObject.message = 'Unauthorized information';
                    responseObject.reason = 401;
                    res.json(responseObject);
                    return;
                }
    
                const lastConnection = await browseModel.getLastConnection(user_id);
                if (lastConnection) {
                    responseObject.lastConnection = moment(lastConnection.last_logged, 'YYYYMMDDhhmmss').add(1, 'hours').fromNow();
                    res.json(responseObject);
                } else {
                    responseObject.status = false;
                    responseObject.message = 'User does not exist!';
                    responseObject.reason = 404;
                    res.json(responseObject);
                };
                responseObject.reason = 404;
                res.json(responseObject);
            }

        } catch (error) {
            responseObject.status = false;
            responseObject.message = "Invalid data";
            res.json(responseObject);
        }
    }
}