const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authorization = require('../../middleware/authorization');
const notificationController = require('../../controllers/NotificationController');

router.get( '/get', auth, authorization.isProfileCompleted, notificationController.getNotifications);

module.exports = router;