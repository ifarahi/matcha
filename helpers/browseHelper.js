const geolib = require('geolib');

module.exports = {
    filterBlocked: (data) => {
        return new Promise((resolve, reject) => {
            const {profiles, blocked} = data;
            const filtredList = profiles.filter((profile) => {
                if (blocked.find((user) => { return user.blocked_id === profile.id}) === undefined)
                    return true;
                else
                    return false;
            });
            resolve(filtredList);
        });
    },

    filterBlockers: (data) => {
        return new Promise((resolve, reject) => {
            const {profiles, blockers} = data;
            const filtredList = profiles.filter((profile) => {
                if (blockers.find((user) => { return user.user_id === profile.id}) === undefined)
                    return true;
                else
                    return false;
            });
            resolve(filtredList);
        });
    },

    filterUncompletedProfiles: (profiles) => {
        return new Promise((resolve, reject) => {
            const filtredList = profiles.filter((profile) => {
                if (profile.is_first_visit === 0)
                    return true;
                else
                    return false;
            });
            resolve(filtredList);
        });
    },

    filterSexualPreferences: (data) => {
        return new Promise((resolve, reject) => {
            const {profiles, sexualPreference} = data;
            let Other = (sexualPreference == 'Other') ? true : false;

            const filtredList = profiles.filter((profile) => {
                if (Other === false){
                    if (sexualPreference === profile.gender)
                        return true;
                    else
                        return false;
                } else {
                    return true;
                }
            });
            resolve(filtredList);
        });
    },


    applyFilter: (data) => {
        return new Promise( async (resolve, reject) => {
            const {profiles, filter, latestUserProfile} = data;
            const {age, tags, distance, rating} = filter;
            const {latitude, longitude} = latestUserProfile;

            // filter with age
            let filtredList = profiles.filter((profile) => {
                if (profile.age >= age[0] && profile.age <= age[1])
                    return true;
                else
                    return false;
            });

            // filter with distance 
            filtredList = profiles.filter((profile) => {
                const dist = Math.trunc(geolib.convertDistance(geolib.getDistance({latitude,longitude}, {latitude: profile.latitude, longitude: profile.longitude}), "km"));
                console.log(dist);
                if (dist <= distance)
                    return true;
                else
                    return false;
            });

            resolve(filtredList);
        });
    }
}