const   database   = require('../database/db');


module.exports = {
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
    }
}