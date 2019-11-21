const geolib = require('geolib');
const tagModel = require('../models/Tags');
const browseModel = require('../models/Browse');
const _ = require('lodash');

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

    filterMatchedProfiles: (data) => {
        return new Promise( async (resolve, reject) => {
            const {profiles, id} = data;
            const matches = await browseModel.fetchMatchedProfiles(id);
            const filtredList = profiles.filter((profile) => {
                if ((profile.id !== matches.user_one) && (profile.id !== matches.user_two))
                    return true;
                else
                    return false;
            });
            resolve(filtredList);
        })
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
            const {age, commonTags, tags, distance, rating} = filter;
            const {latitude, longitude, tags:userTags } = latestUserProfile;

            try {

                // filter with age
                let filtredList = profiles.filter((profile) => {
                    if (profile.age >= age[0] && profile.age <= age[1])
                        return true;
                    else
                        return false;
                });

                // filter with distance 
                filtredList = filtredList.filter((profile) => {
                    profile.tags = []; // Assign empty tags array to be used on tags filtring
                    const dist = Math.trunc(geolib.convertDistance(geolib.getDistance({latitude,longitude}, {latitude: profile.latitude, longitude: profile.longitude}), "km"));
                    profile.distance = dist;
                    if (dist <= distance)
                        return true;
                    else
                        return false;
                });

                // fetch all tags
                const usersTags = await tagModel.usersGetTags();
                usersTags.forEach(tag => {
                    let profile = filtredList.find((profile) => profile.id === tag.user_id);

                    if (profile !== undefined){
                        profile.tags.push(tag.name);
                    }
                });

                // filter with common tags number && filter with giving tags
                filtredList = filtredList.filter((profile) => {
                    if (tags.length > 0)
                        return _.intersection(tags, profile.tags).length == tags.length;
                    return _.intersection(userTags, profile.tags).length >= commonTags;
                });

                filtredList = filtredList.filter((profile) => profile.rating >= rating[0] && profile.rating <= rating[1]);
                resolve(filtredList);
            } catch (error) {
                return reject(error);
            }

        });
    }
}
