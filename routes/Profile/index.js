const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
const   cleanTag = require('../../middleware/tag_cleaner');
const   ProfileController = require('../../controllers/ProfileController');
const   uploadEngine = require('../../middleware/uploadImages');


router.use('/completeProfile_info', auth, validation.completeProfile_info, ProfileController.completeProfile_info);

router.use('/completeProfile_images', auth, 
    ProfileController.isReachedMaxPictures, 
    uploadEngine.upload.single('image'),
    uploadEngine.validate,
    ProfileController.completeProfile_images);

router.use('/setProfilePicture', auth, ProfileController.setProfilePicture);

router.use('/deleteUserImage', auth, ProfileController.deleteUserImage);
// const   testController = require('../../helpers/tagRemover')
// const   testController = require('../../helpers/tagAdder')


// // router.get('/:tagName', cleanTag, tagController.tagExists)

// router.get('/check/:id/:tagname', async (req, res) => {
//     // console.log(req.params.id +  " " + req.params.tagname)
//     // tagController.userExists(req.params.id)
//     // tagController.getTagId(req.params.tagname)
//     // tagController.userHasTag(req.params.id, req.params.tagname)
//     // tagController.userAddTag( req.params.id, req.params.tagname )
//     // console.log(await tagController.userAddTag( req.params.id, req.params.tagname ))
//     // console.log( tagController.userDeleteTag(  0, 'leet' ) )
//     // await console.log(tagController.userDeleteTag( req.params.id, req.params.tagname ))
//     // console.log( await testController.userTagDelete( req.params.id, req.params.tagname ) );
//     console.log( await testController.userTagAdd( req.params.id, req.params.tagname ) );

//     res.send("CHAZZZZZE")
// })
// router.post('/tagsloop', (req, res) => {
//     const tags = req.body;
//     Object.entries(tags).forEach( ([ key, value ] ) => {
//         console.log(`object key => ${key} and it's value => ${value}`)
//     }); 
// })

module.exports = router;