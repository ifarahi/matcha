const   database   = require('../database/db');


module.exports = {

    userExists : (id) => { // checks if the tagname is already exists
        return new Promise((resolve, reject) => { 
            database.query('SELECT count(*) as rows FROM users WHERE id = ?', id, (error, result) => {
                if (error) reject(error);
                else resolve(result[0].rows);
            });
        });
    },

    tagExists : (tagName) => { // checks if the tagname is already exists
        return new Promise((resolve, reject) => { 
            database.query('SELECT count(*) as rows FROM tags WHERE name = ?', tagName, (error, result) => {
                if (error) reject(error);
                else resolve(result[0].rows);
            });
        });
    },

    getTagId : (tagName) => { // return the tag id if exists
        return new Promise((resolve, reject) => {
            database.query('SELECT id FROM tags WHERE name = ?', tagName, (error, result) => {
                if (error) reject(error);
                else resolve(result[0].id);
            });
        });
    },

    tagAdd : (tagName) => { //adds tag to the tags list
        return new Promise((resolve, reject) => { 
            database.query('INSERT INTO tags (name) VALUES (?)', tagName, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    },

    userTagExists : (userId, tagId) => { // Checks if the user already has the tag or not (returns a counter)
        return new Promise((resolve, reject) => { 
            database.query('SELECT count(*) as rows FROM user_tags WHERE user_id = ? AND tag_id = ?', [ userId, tagId ], (error, result) => {
                if (error) reject(error);
                else resolve(result[0].rows);
            });
        });
    },

    userTagAdd : (userId, tagId) => { // Adds a tag to a specified user in the user_tags
        return new Promise((resolve, reject) => { 
            database.query('INSERT INTO user_tags (tag_id, user_id) VALUES (?, ?)', [ tagId, userId ],  (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    },

    userGetTagId : (userId, tagId) => { // Gets the id of a given tag_id and user_id (useful for delete)
        return new Promise((resolve, reject) => {
            database.query('SELECT id FROM user_tags WHERE tag_id = ? AND user_id = ?', [ tagId, userId ], (error, result) => {
                if (error) reject(error);
                else resolve(result[0].id);
            });
        });
    },

    userDeleteTag : (tagId) => { // Deletes a given tag from a user tags list
        return new Promise((resolve, reject) => {
            database.query('DELETE FROM user_tags WHERE id = ?', tagId, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }
}