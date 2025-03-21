const express = require('express');
const { loginController, signupController,profileController } = require('../Controller/User');
const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);
router.put('/complete-profile/:userId',profileController);
module.exports = router;