// src/routes/user.routes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import session from 'express-session';

import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.use(express.static(path.join(__dirname, '../../public/user/home')));

// router.use(express.statrouter.use('/imgs', express.static(path.join(__dirname, 'public/user/home/imgs')));
// Serve the home page
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/user/home/index.html'));
});

router.use(express.static(path.join(__dirname, '../../public/user/loginAndRegister')));
// router.use(express.static(path.join(__dirname, '../../public/user/loginAndRegister/images')));

// serve the login and register page
router.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/user/loginAndRegister/index.html'));
})

import validateMobileNumber from '../middlewares/validateMobileNumber.middlewares.js'
import { userLogin, userRegister, UserLogout, resendOtp } from '../controllers/user.controllers.js'
import { verifyJWT } from '../middlewares/verifyJwt.js';
import { authorization } from '../middlewares/roleAuth.js';
router.route('/account/login').post(validateMobileNumber, userLogin);

router.route('/account/register').post(validateMobileNumber, userRegister)
// verifyJWT
router.route('/account/logout').post(verifyJWT, UserLogout)

router.route('/account/login/resend-Otp').post(session(), resendOtp)

router.route("/account/register/resend-Otp").post(session(), resendOtp)

router.get('/admin', authorization('admin'), async (req, res) => {
    res.send('This is a admin place')
})

export default router;