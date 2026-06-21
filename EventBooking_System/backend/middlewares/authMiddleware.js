import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Users } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized token'
            })
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await Users.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist-unable to verify tokens"
            })
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log("Error in verifying the tokens",error)
        
        res.status(404).json({
            success: false,
            message: `Error in verifying the tokens,${error}`
        })
    }
    
})