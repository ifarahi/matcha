const browseModel = require('../models/Browse');
const privacyModel = require('../models/Privacy');
const tagsModel = require('../models/Tags');
const browseHelper = require('../helpers/browseHelper');

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

    }
}