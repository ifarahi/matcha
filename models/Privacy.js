const databse  = require('../database/db');

module.exports = {
    blockUser: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'INSERT INTO blocks (user_id, blocked_id) VALUES (?,?)';
            const values = [user_id,blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    unblockUser: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'DELETE FROM blocks WHERE user_id = ? AND blocked_id = ?';
            const values = [user_id,blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    isUserBlocked: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'SELECT * FROM blocks WHERE user_id = ? AND blocked_id = ?';
            const values = [user_id,blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    isUserBlocker: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'SELECT * FROM blocks WHERE user_id = ? AND blocked_id = ?';
            const values = [user_id,blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    getBlockedList: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM blocks WHERE user_id = ?';
            databse.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    getBlockersList: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM blocks WHERE blocked_id = ?';
            databse.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    report: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'INSERT INTO reports (user_id, reported_id) VALUES (?, ?)';
            const values = [user_id, blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
            });
        });
    },

    isReported: (data) => {
        return new Promise((resolve, reject) => {
            const {user_id, blocked_id} = data;
            const sql = 'SELECT count(*) AS isReported FROM reports WHERE user_id = ? AND reported_id = ?';
            const values = [user_id, blocked_id];
            databse.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    getBlockedListInfo: (id) => {
        return new Promise((resolve, reject) => {
            const fields = "users.`id`, users.`firstname`, users.`lastname`, users.`username`, users.`profile_picture`";
            const sql = `SELECT ${fields} FROM blocks JOIN users ON (user_id = ? AND blocked_id = users.id)`;
            databse.query(sql, [ id, id ], (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },
}