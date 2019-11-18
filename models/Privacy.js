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
    }
}