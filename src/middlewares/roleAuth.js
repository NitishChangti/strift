import { User } from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js"


const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
            console.log('token is', token)
            if (!token) {
                res.status(400).json(
                    new ApiError(401, "Unauthorized request")
                )
            }
            const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            console.log('decoded token is', decodedToken)
            const user = await User.findById(decodedToken?.userId).select(
                "-otp -refreshToken"
            )
            console.log(user)
            if (!user) {
                res.status(400).json(
                    new ApiError(401, "Invalid Access Token")
                )
            }
            req.user = user;
            // console.log(req.user, user)
            if (!allowedRoles.includes(user.role)) {
                res.status(400).json(

                    new ApiError(403, "Forbidden")
                )
            }
            next()
        } catch (error) {
            console.error(error)
            //         return res.status(500).json({ message: 'Internal server error' }); // Handle server errors
        }
    }
}
export { authorization }