const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
const   cleanTag = require('../../middleware/tag_cleaner');
const   tagController = require('../../controllers/ProfileController');

// router.get('/:tagName', cleanTag, tagController.tagExists)
router.post('/addtag', cleanTag, tagController.addTag)
router.post('/tagsloop', (req, res) => {
    const tags = req.body;
    console.log(tags)
    console.log(Object.keys(tags))
    console.log(Object.entries(tags))
    // console.log(Object.entries(tags))
//    Object.entries(tags).forEach( ([ key, value ] ) => {
//        console.log(`object key => ${key} and it's value => ${value}`)
//    }); 
})

module.exports = router;