const browseModel = require('../models/Browse');
const privacyModel = require('../models/Privacy');
const browseHelper = require('../helpers/browseHelper');

module.exports = {
    fetchProfiles: async (req, res) => {
        const {id} = req.decodedObject;
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

            // filter profiles list from blocked profiles
            profiles = await browseHelper.filterBlocked({profiles, blocked});

            // filter profiles list from blockers profiles
            profiles = await browseHelper.filterBlockers({profiles, blockers});

            //filter uncompleted profiles
            profiles = await browseHelper.filterUncompletedProfiles(profiles);

            profile = await browseModel.fetchUserProfile(id);

            res.json(profiles);
            return;
        } catch (error) {
            res.json(error);
        }
    }
}