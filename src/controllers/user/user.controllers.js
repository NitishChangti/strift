import { asyncHandler } from '../../utils/asyncHandler.js'
import { User, Address } from '../../models/user.models.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiRes.js';
import otpGenerator from 'otp-generator';
import { body, validationResult } from 'express-validator';
import Jwt from "jsonwebtoken";
import { product } from '../../models/product.js';

import mongoose, { Schema, mongo } from "mongoose";

import validateMobileNumber from '../../middlewares/validateMobileNumber.middlewares.js';
import { otpSender, registerOtpSender } from '../../utils/otpSend.user.js';
import session from 'express-session';
import moment from 'moment-timezone';
import { stat } from 'fs';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log(`user id is : ${userId}`)
        const user = await User.findById(userId);

        console.log(`user  is : ${user}`)
        const accessToken = Jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
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

const userProfile = asyncHandler(async (req, res) => {
    try {
        // logic is
        // 1.  based on authorization i will check is user is logged or not also i got user detail(token)
        // 2. i will check data coming or not in req obj if it comes  using found user(token) i will apply on that query and send response
        // 3. if data didn't come i will find user using token then send data response backs
        console.log('user profile', req.user)
        console.log('req body is ', req.body)
        const { firstName, lastName, gender, email, phone } = req.body;
        const query = {}
        if (firstName && typeof firstName === 'string' && firstName.length > 0) query.firstName = firstName
        if (lastName && typeof lastName === 'string' && lastName.length > 0) query.lastName = lastName
        if (gender && typeof gender === 'string' && gender.length > 0) query.gender = gender
        if (email && typeof email === 'string' && email.length > 0) query.email = email
        if (phone && typeof phone === 'string' && phone.length > 0) query.phone = phone
        console.log('before find', query)
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: query },
            { new: true }
        ).select('-otp -__v -updatedAt -createdAt -role -refreshToken -address ')  // this is used because we don't want to send otp and other data in response
        console.log('after find', user)
        if (!user) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    'User not found',
                    null,
                    false
                )
            )
        }
        console.log('before return')

        return res.status(200).json(new ApiResponse(
            200,
            'User profile updated successfully',
            user,
            true
        ))

    } catch (error) {
        console.log('error', error)
        // Send response only once in case of error
        if (!res.headersSent) {
            return res.status(500).json(new ApiResponse(
                500,
                'Internal server error',
                null,
                false
            ));
        }

    }
})

const getUserProfileData = asyncHandler(async (req, res) => {
    try {
        console.log('before find', req.user)
        const user = await User.findOne({ _id: req.user._id }).select('-otp -__v -updatedAt -createdAt -role -refreshToken -address ')
        console.log('after find', user)
        if (!user) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    'User not found',
                    null,
                    false
                )
            )
        }
        return res.status(200).json(new ApiResponse(
            200,
            { user },
            'User profile data',
            true
        ))

    } catch (error) {
        console.log('error', error)
        // Send response only once in case of error
        if (!res.headersSent) {
            return res.status(500).json(new ApiResponse(
                500,
                'Internal server error',
                null,
                false
            ));
        }
    }
})

const userProfileAddress = asyncHandler(async (req, res) => {
    try {
        console.log('before find', req.body)
        const { name, phoneNumber, address, city, state, pinCode, locality, landmark, altNumber, addressType } = req.body
        console.log(name, phoneNumber, address, city, state, pinCode, locality, landmark, altNumber, addressType)

        let query = {}
        if (name && typeof name === 'string' && name.length > 0 && name != null) query.name = name
        if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.length > 0 && phoneNumber != null) query.phoneNumber = phoneNumber
        if (address && typeof address === 'string' && address.length > 0 && address != null) {
            query.address = address
            console.log('address')
        }
        if (city && typeof city === 'string' && city.length > 0 && city != null) query.city = city
        if (state && typeof state === 'string' && state.length > 0 && state != null) query.state = state
        if (pinCode && typeof pinCode === 'string' && pinCode.length > 0 && pinCode != null) {
            query.pinCode = pinCode
            console.log('address')
        }
        if (locality && typeof locality === 'string' && locality.length > 0 && locality != null) query.locality = locality
        if (landmark && typeof landmark === 'string' && landmark.length > 0 && landmark != null) query.landmark = landmark
        if (altNumber && typeof altNumber === 'string' && altNumber.length > 0 && altNumber != null) query.altNumber = altNumber
        if (addressType && typeof addressType === 'string' && addressType.length > 0 && addressType != null) query.addressType = addressType

        console.log('query', query)
        // Find the existing user by userId and add the new address to their address array
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    'User not found',
                    null,
                    false
                )
            )
        }
        console.log('address data before pushed  in db ')

        // Add the new address to the address array
        user.address.push({
            ...query,
            updatedAt: new Date() // Add timestamp for the new address
        });
        console.log('address data before saved in db ', user.address)

        // Save the updated user document
        await user.save();
        console.log('address data saved in db ')
        console.log('before return', user.address)
        console.log('done')
        return res.status(200).json(new ApiResponse(
            200,
            { user },
            'User address added successfully',
            true
        ))


    } catch (error) {
        // console.log('error', error)
        // Send response only once in case of error
        // if (!res.headersSent) {
        // return res.status(500).json(new ApiResponse(
        //     500,
        //     'Internal server error',
        //     error,
        //     null,
        // ))
        // }



        // Check if it's a mongoose validation error
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.errors, // Specific validation errors
            });
        }

        // For other errors, send the error message
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,  // Add the error message for easier debugging
            stack: error.stack,    // Log stack trace for debugging
        });
        // }
    }
})


const getUserAddress = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        console.log(user.address)
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
            ))
        }
        const userAddress = user.address
        return res.status(200).json(new ApiResponse(
            200,
            { userAddress },
            'User address retrieved successfully',
            true
        ))

    } catch (error) {
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            error,
        ))
    }
})

const delteUserAddress = asyncHandler(async (req, res) => {
    try {
        const index = req.query.index
        console.log('index', index)
        const user = await User.findById(req.user._id)
        console.log(user.address)
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
            ))
        }

        if (!Array.isArray(user.address) || index < 0 || index >= user.address.length) {
            return res.status(400).json(new ApiResponse(
                400,
                'Invalid index',
                null,
            ));
        }
        const removedAddress = user.address.splice(index, 1)[0];
        console.log('index address', removedAddress)
        await user.save()
        return res.status(200).json(new ApiResponse(
            200,
            { removedAddress },
            'User address deleted successfully',
            true
        ))
    } catch (error) {
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            error.message,
        ))
    }
})


function parseSearchQuery(queryString) {
    const searchParams = {
        searchKeywords: queryString,  // Default to the full query string for text search
        maxPrice: null,
        minPrice: null,
    };

    // Check if the query contains price filters (like "under 2000")
    const priceMatch = queryString.match(/under\s*(\d+)/i);
    if (priceMatch) {
        searchParams.maxPrice = parseInt(priceMatch[1], 10); // Extract price
    }

    // Check if the query contains a range like "between 1000 and 2000"
    const priceRangeMatch = queryString.match(/between\s*(\d+)\s*and\s*(\d+)/i);
    if (priceRangeMatch) {
        searchParams.minPrice = parseInt(priceRangeMatch[1], 10);
        searchParams.maxPrice = parseInt(priceRangeMatch[2], 10);
    }

    return searchParams;
}

const searchForProductByUser = asyncHandler(async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery;
        console.log(searchQuery)
        // Parse the search query for price filters (under, between, etc.)
        const { searchKeywords, maxPrice, minPrice } = parseSearchQuery(searchQuery);

        // Build the MongoDB query object
        const queryObj = {};
        // If there are search keywords, perform a text search
        if (searchKeywords) {
            queryObj.$text = { $search: searchKeywords };
        }
        // Apply price filters (if any)
        if (maxPrice) {
            queryObj.price = { $lte: maxPrice };  // e.g., under 2000
        }
        if (minPrice && maxPrice) {
            queryObj.price = { $gte: minPrice, $lte: maxPrice };  // e.g., between 1000 and 2000
        }
        // Fetch the filtered products from MongoDB
        const products = await product.find(queryObj);
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found matching your query.' });
        }


        console.log("products", products)
        // res.send('done')
        // Return the products to the frontend
        return res.status(200).json(
            new ApiResponse(
                200,
                { products },
                "Products found",
                true
            )
        )
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching products' });
    }
})
const searchProductDetail = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        console.log("id", id)
        const products = await product.findById(id);
        if (!products) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log(products)

        return res.status(200).json(
            new ApiResponse(
                200,
                { products },
                "Product found",
                true
            )
        )
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching product details' });
    }
})

export { userLogin, userRegister, UserLogout, resendOtp, userProfile, getUserProfileData, userProfileAddress, getUserAddress, delteUserAddress, searchForProductByUser, searchProductDetail }
