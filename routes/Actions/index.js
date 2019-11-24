const express = require('express');
const router = express.Router();
const validation = require('../../middleware/validation');
const actionsController = require('../../controllers/ActionsContoller');
const auth = require('../../middleware/auth');
const {isProfileCompleted} = require('../../middleware/authorization');

router.post('/likeUser', auth, isProfileCompleted, validation.actions, actionsController.likeUser);
router.post('/unlikeUser', auth, isProfileCompleted, validation.actions, actionsController.unLikeUser);
router.post('/unMatch', auth, isProfileCompleted, validation.actions, actionsController.unMatch);

module.exports = router;