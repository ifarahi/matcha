const tagsModel = require('../models/Tags.js');

module.exports = {
    tagExists : async ( tagName ) => {
        try{
            const result = await tagsModel.tagExists( tagName )
            return({
                status : true,
                result : result
            })
        }catch(err){
            return ({
                status : false,
                result : "Couldn't search for the username in the database."
            })
        }
    },
    addTag : async ( req, res ) => {
        const { tagname : tagName } = req.body
        try {
            const check = await module.exports.tagExists( tagName )
            if ( check.status === true  &&  check.result === 0){
                try {
                    result = await tagsModel.tagAdd(tagName)
                    res.json({
                        status : true,
                        result : result.insertId  
                    })
                } catch ( err ) {
                    console.log("Couldn't add tag to the database")
                }
            } else if ( check.status === true ) {
                try{
                    const tagId = await tagsModel.getTagId( tagName ) 
                    res.send ({
                        status : true,
                        result : tagId
                    })
                } catch ( err ){
                    res.send(err);
                }
            }
        } catch ( err ) {
            res.json({
                status : false,
                result : "Couldn't fetch the database"  
            })
        }
    }
}