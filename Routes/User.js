const express = require('express');
const { loginController, signupController } = require('../Controller/User');
const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);

module.exports = router;