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
    }
}