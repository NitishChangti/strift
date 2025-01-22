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

router.use(express.static(path.join(__dirname, '../../../public/user/home')));
router.use(express.static(path.join(__dirname, '../../../public/user/home/header.html')));
// import srsds from '../../../public/user/home';
// Serve header.html file
router.get('/header', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/header.html'));
});
router.get('/footer', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/footer.html'));
});
// router.use(express.statrouter.use('/imgs', express.static(path.join(__dirname, 'public/user/home/imgs')));
// Serve the home page
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/index.html'));
});

router.use(express.static(path.join(__dirname, '../../../public/user/loginAndRegister')));
// router.use(express.static(path.join(__dirname, '../../public/user/loginAndRegister/images')));

// serve the login and register page
router.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/loginAndRegister/index.html'));
})

import validateMobileNumber from '../../middlewares/validateMobileNumber.middlewares.js'
import { userLogin, userRegister, UserLogout, resendOtp, userProfile, getUserProfileData, userProfileAddress, getUserAddress, delteUserAddress, searchForProductByUser, searchProductDetail } from '../../controllers/user/user.controllers.js'
import { verifyJWT } from '../../middlewares/verifyJwt.js';
import { authorization } from '../../middlewares/roleAuth.js';
router.use(express.static(path.join(__dirname, '../../../public/user/profile')));
// import { verifyJWT } from '../../../public/user/home';

router.get('/account/profile', (req, res) => {
    // res.send('hello')
    res.sendFile(path.join(__dirname, '../../../public/user/profile/profile.html'));
})
router.route('/account/login').post(validateMobileNumber, userLogin);

router.route('/account/register').post(validateMobileNumber, userRegister)
// verifyJWT
router.route('/account/logout').post(verifyJWT, UserLogout)

router.route('/account/login/resend-Otp').post(session(), resendOtp)

router.route("/account/register/resend-Otp").post(session(), resendOtp)

router.get('/admin', authorization('admin'), async (req, res) => {
    res.send('This is a admin place')
})

router.route('/account/profile').put(authorization('user'), userProfile)
router.route('/account/profile/userData').get(authorization('user'), getUserProfileData)

router.route('/account/profile/address').post(authorization('user'), userProfileAddress)
router.route('/profile/fetchAddress').get(authorization('user'), getUserAddress);
router.route('/profile/deleteAddress').delete(authorization('user'), delteUserAddress)

router.route('/searchForProducts').get(authorization('user'), searchForProductByUser)

router.route('/productdetail').get(authorization('user'), searchProductDetail)


export default router;