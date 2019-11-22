const browseModel = require('../models/Browse');
const privacyModel = require('../models/Privacy');
const profileModel = require('../models/Profile');
const userModel = require('../models/Users');
const tagsModel = require('../models/Tags');
const browseHelper = require('../helpers/browseHelper');
const fetch = require('node-fetch');

module.exports = {
    fetchProfiles: async (req, res) => {
        const {id} = req.decodedObject;
        const filter = req.body.filter;
        const responseObject = {
            status: true,
        }

        // if the user profile not completed cannot update this information the request should be end
        try {
            const {is_first_visit} = await browseModel.fetchUserProfile(id);
            if (is_first_visit !== 0){
                responseObject.status = false;
                responseObject.message = 'You need to complete your profile';
                res.json(responseObject);
                return;
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
            return ;
        }

        try {
            let profiles = await browseModel.fetchProfiles(id);
            const blocked = await privacyModel.getBlockedList(id);
            const blockers = await privacyModel.getBlockersList(id);
            const latestUserProfile = await browseModel.fetchUserProfile(id);

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

            // apply given or default filter preferences
            profiles = await browseHelper.applyFilter({profiles, filter, latestUserProfile});

            responseObject.profiles = profiles;
            res.json(responseObject);

        } catch (error) {
            responseObject.status = false;
            responseObject.message = `something went wrong Error: ${error}`;
            res.json(responseObject);
        }
    },

    fetchUserProfile: async (req, res) => {
        const { username } = req.body;
        const {id:connected} = req.decodedObject;
        const responseObject = {
            status: true
        }
        // console.log(id)
        try {

            // check if the user is exists
            const userExists = await userModel.usernameExists(username);
            if (userExists < 1) {
                responseObject.status = false;
                responseObject.message = 'Bad request';
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
                    res.json(responseObject);
                    return;
                }

                // fetch user tags
                userProfile.tags = await tagsModel.userGetTags(userProfile.id);
                // set user tags on array instad of array object
                userProfile.tags = userProfile.tags.map(elm => elm.name);
    
    
                // fetch user location with the given geoLocation
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`);
                const data = await response.json();
                userProfile.location = data.results[0].formatted_address;
    
                // fetch user images 
                const userImages = await profileModel.getUserImages(requested);
                userProfile.images = userImages.map(elm => elm.image);
    
                responseObject.userProfile = userProfile;
                res.json(responseObject);
            }

        } catch (error) {
            responseObject.status = false;
            responseObject.message = error.message;
            res.json(responseObject);
        }

    }
}