const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authorization = require('../../middleware/authorization');
const validation = require('../../middleware/validation');
const notificationController = require('../../controllers/NotificationController');

router.get( '/get/notifications', auth, authorization.isProfileCompleted, notificationController.getNotifications);
router.get( '/get/messages', auth, authorization.isProfileCompleted, notificationController.getNewMessagesCount);
<<<<<<< HEAD
router.post( '/read/messages', auth, authorization.isProfileCompleted, notificationController.setMessagesToSeen);
router.post( '/read/notifications', auth, authorization.isProfileCompleted, notificationController.setNotificaionsToSeen);
=======
// router.post( '/read/messages', auth, authorization.isProfileCompleted, notificationController.setMessagesToSeen);
router.post( '/read/notifications', auth, authorization.isProfileCompleted, notificationController.setNotificaionsToSeen);
router.post( '/read/messages', auth, authorization.isProfileCompleted, validation.validUserId, notificationController.setMessagesToSeen);
>>>>>>> 61e710a18e88325743a25ca80d77651c430c0c68
router.get('/get/notificationsInfo', auth , authorization.isProfileCompleted, notificationController.fetchNotificationsInfo );

module.exports = router;