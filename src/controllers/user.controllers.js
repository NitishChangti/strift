import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import otpGenerator from 'otp-generator';
import { body, validationResult } from 'express-validator';
import Jwt from "jsonwebtoken";


import validateMobileNumber from '../middlewares/validateMobileNumber.middlewares.js';
import { otpSender, registerOtpSender } from '../utils/otpSend.user.js';
import session from 'express-session';
import moment from 'moment-timezone';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log(`user id is : ${userId}`)
        const user = await User.findById(userId);

        console.log(`user  is : ${user}`)
        const accessToken = Jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });
        const refreshToken = Jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}


const userLogin = asyncHandler(async (req, res, next) => {
    // if(req.query==='/'){
    // take  the user input(mobile number) from req
    // validate the mobile number
    //  check if the user exists in the database
    //  if the user exists, then send the otp  to the user and store in database
    //  if the user does not exist, then send a message saying user does not exist and render to signup route
    // }
    // else{
    // redirect to /account/register?sigup=TRUE
    // }

    console.log(req.query.ret === "/");

    const ret = req.query.ret === "/"
    const phone = req.body.phone;
    const otp = req.body.otp;
    console.log(ret)
    if (ret === true) {
        if (!otp) {
            const result = await validateMobileNumber[0].run(req);
            if (phone.startsWith("+") && result.errors.length === 0) {
                console.log('validation is success');
                // return 'done'
                new ApiResponse(200, '', 'phone number is valid', true)
                // res.status(201).json(new ApiResponse(200, '', 'phone number is valid', true))
            }
            else {
                //             // console.log(false);
                //             console.log(result.errors);
                throw new ApiError(400, 'mobile number  is invalid ')
            }
            const user = await User.findOne({ phone: phone })
            if (user) {
                // console.log(user)   if user exists it gives userOtp data
                console.log('user is exists')
                req.session.mobileNumber = user.phone;   //here changed
                await req.session.save()
                console.log(`user mobilenumber is ${req.session.mobileNumber}`)       //here changed
                const loginOtpSender = await otpSender(user.phone)
                console.log(loginOtpSender)
                console.log('session', req.session.mobileNumber)
            }
            else {
                console.log('user doesnot exists')
                return res.json({ redirect: '/account?signup=true' });
                //             // res.redirect('/account/login?signup=true')
            }
        }
        else {
            console.log('login otp verification section')
            const phone = req.session.mobileNumber;               //here changed
            //         // const userOtpRequestCurrentTime = req.body.currentTime
            const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
            console.log(otp, userOtpRequestCurrentTime, req.session.mobileNumber)          //here changed
            const user = await User.findOne({ phone: phone });

            console.log(user, user.otp[0].otpCode, 'otpcode')
            if (user) {
                const otpExpirationTime = moment(user.otp[0].otpExpirationTime).tz('UTC'); // assume UTC timezone
                console.log(otpExpirationTime > userOtpRequestCurrentTime)
                console.log(otpExpirationTime, '\n', userOtpRequestCurrentTime)
                if (user.otp[0].otpCode === otp && otpExpirationTime > userOtpRequestCurrentTime) {
                    console.log('success');
                    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
                    const loggedInUser = await User.findById(user._id).select("-refreshToken -otp")
                    const options = {
                        httpOnly: true,
                        secure: true
                    }
                    if (user.role === 'user') {

                        return res.status(200)
                            .cookie("accessToken", accessToken, options)
                            .cookie("refreshToken", refreshToken, options)
                            .json(
                                new ApiResponse(
                                    200,
                                    {
                                        user: user, accessToken, refreshToken, redirect: '/home',
                                    },
                                    "User logged in successfully",
                                )
                            )
                    }
                    else {
                        return res.status(200)
                            .cookie("accessToken", accessToken, options)
                            .cookie("refreshToken", refreshToken, options)
                            .json(
                                new ApiResponse(
                                    200,
                                    {
                                        user: user, accessToken, refreshToken, redirect: '/admin'
                                    },
                                    "Admin logged in successfully",

                                )
                            )
                    }
                }
                else {
                    // throw new ApiError(404, 'Login is not successfull or invalid credentials and otp is expired')
                    return res.status(400).json(400, 'login is not successfull or invalid credentials')

                }
            }
            else {
                return res.status(404).json({ error: 'User  not found' });
            }
        }

    }
    else {
        res.json({ redirect: '/account?signup=true' });
    }
})

const userRegister = asyncHandler(async (req, res) => {
    //register controller part start from here
    console.log('register controller part start from here')
    console.log(req.query, req.body)
    const signup = req.query.signup
    const phone = req.body.phone
    const otp = req.body.otp
    if (signup === 'true') {
        if (!otp) {
            const result = await validateMobileNumber[0].run(req);
            console.log(result)
            if (phone.startsWith("+") && result.errors.length === 0) {
                console.log('validation is success');
                // res.status(201).json(new ApiResponse(200, '', 'phone number is valid', true))
                new ApiResponse(200, '', 'phone number is valid', true)  // this response is not going back to frontend
            }
            else {
                console.log(false);
                console.log(result.errors);
                throw new ApiError(500, 'mobile number  is invalid ')  // this response is not goinh back to frontend
            }
            // const user = await UserOtp.findOne({ phone: phone })
            const user1 = await User.findOne({ phone: phone })  //
            console.log(user1)
            if (!user1) {
                console.log('user  is not exist , new user')
                req.session.tempMobileNumber = phone;
                await req.session.save();
                const regOtpSender = await registerOtpSender(req, phone);
                console.log(regOtpSender)
                console.log('session:-', req.session.tempMobileNumber)
            }
            else {
                console.log('user is already exist')
                // res.send(400).json(new ApiResponse(400, '', 'user already exists with this mobile number ', false))
                res.json({ redirect: '/account?ret = /' })
            }
        }
        else {
            console.log('registration otp verification section')
            const phone = req.session.tempMobileNumber;
            const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
            console.log(userOtpRequestCurrentTime, req.session)          //here changed    
            console.log(otp, req.session.tempOtp)
            const otpExpirationTime = moment(req.session.tempOtpExpirationTime).tz('UTC'); // assume UTC timezone
            console.log(otpExpirationTime > userOtpRequestCurrentTime)
            console.log(otpExpirationTime, '\n', userOtpRequestCurrentTime)

            if (req.session.tempOtp === otp && otpExpirationTime > userOtpRequestCurrentTime) {
                console.log('success otp is verified in registration');
                req.session.isLoggerIn = true;
                const newUserOtp = await User.create({
                    phone: phone,
                    otp: {
                        otpCode: otp,
                        otpGeneratedTime: req.session.tempOtpGeneratedTime,
                        otpExpirationTime: req.session.tempOtpExpirationTime
                    }
                })
                //                 req.session.userId = newUserOtp._id;
                //                 console.log(newUserOtp)
                //                 // res.json(new ApiResponse(200, '', 'registration is successfull', true))
                //                 // res.redirect('/home')
                res.json({ redirect: '/home' });
            }
            else {
                res.status(400).json(404, 'registration is not successfull or invalid credentials')
            }
        }
    }
})


const UserLogout = asyncHandler(async (req, res) => {
    console.log(1)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )
    console.log(11)

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ err: 'failed to logout, please try again.' })
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        //clear cookies
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);
        console.log(111)

        //REDirect the user to the homepage or login page
        return res.status(200).json(new ApiResponse(200, { redirect: '/home' }, "User logged outs", true))
    }
    )
})

const resendOtp = asyncHandler(async (req, res) => {
    // console.log(req.session);
    const phone = req.session.mobileNumber       //here changed
    console.log(phone)
    const user = await User.findOne({ phone: phone })
    // console.log(user)

    if (user) {
        const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
        const otpExpirationTime = moment(user.otp[0].otpExpirationTime).tz('UTC'); // assume UTC timezone

        if (otpExpirationTime > userOtpRequestCurrentTime) {
            console.log(`otp is not expired`)
        }
        else {
            console.log(user.phone)
            console.log('otp is expired', otpSender(user.phone))
        }
    } else {
        const phone = req.session.tempMobileNumber
        console.log('user  is not found', req.session.tempMobileNumber)
        console.log(registerOtpSender(req, phone))

    }
})

export { userLogin, userRegister, UserLogout, resendOtp }
