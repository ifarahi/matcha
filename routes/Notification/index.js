const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authorization = require('../../middleware/authorization');
const notificationController = require('../../controllers/NotificationController');

router.get( '/get/notifications', auth, authorization.isProfileCompleted, notificationController.getNotifications);
router.get( '/get/messages', auth, authorization.isProfileCompleted, notificationController.getNewMessagesCount);
router.post( '/read/messages', auth, authorization.isProfileCompleted, notificationController.setMessagesToSeen);


module.exports = router;