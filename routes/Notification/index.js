const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authorization = require('../../middleware/authorization');
const validation = require('../../middleware/validation');
const notificationController = require('../../controllers/NotificationController');

router.get( '/get/notifications', auth, authorization.isProfileCompleted, notificationController.getNotifications);
router.get( '/get/messages', auth, authorization.isProfileCompleted, notificationController.getNewMessagesCount);
router.post( '/read/messages', auth, authorization.isProfileCompleted, validation.validUserId, notificationController.setMessagesToSeen);
router.get('/get/notificationsInfo', auth , authorization.isProfileCompleted, notificationController.fetchNotificationsInfo );

module.exports = router;