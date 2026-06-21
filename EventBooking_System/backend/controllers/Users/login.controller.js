import { asyncHandler } from '../../utils/asyncHandler.js'
import { Users } from '../../models/user.model.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await Users.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        console.log("Error generating JWT tokens",error)
        throw error;
    }
}

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log(`User login controller is responding ${req.body}`)
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email or password is missing"
    })
  }

  const user = await Users.findOne({ email })

  if (!user) {
    console.log('User not found !')
    return res.status(404).json({
      success: false,
      message: "User doesn't exist"
    })
  }
  
  if (user.role === 'Admin' && user.status === 'Rejected') {
    return res.status(401).json({
        success: false,
        message: "Your admin registration was rejected by the system"
    })
  }

  if (user.role === 'Admin' && user.status !== 'Approved') {
    return res.status(401).json({
        success: false,
        message: "Your admin registration is pending approval"
    })
  }

  const verified = await bcrypt.compare(password, user.password)

  if (!verified) {
    return res.status(401).json({
      success: false,
      message: "Wrong password"
    })
  }
  
  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
    success: true,
    message: "User login successful",
    body: {
      _id: user._id,
      email: user.email,
      role: user.role
    }
  })
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(404).json({
          success: false,
          message: "Unauthorized request"
        })
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await Users.findById(decodedToken?._id)
    
        if (!user) {
            return res.status(404).json({
              success: false,
              message: "User doesn't exist"
            })
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(404).json({
              success: false,
              mesage: "Invalid refresh token"
            })
        }
    
        const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
           success: true,
           message: "access token refreshed successfully"
        })
    } catch (error) {
        console.log("Error message",error)

        res.status(404).json({
          success: false,
          message: `error regenerating access tokens , ${error}`
        })
    }

})

export const logOut = asyncHandler(async(req,res)=>{

  await Users.findByIdAndUpdate(
  req.user._id,
  {
    $unset: {refreshToken: 1}
  },
  {
    new: true
  })

  const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
  }
    

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json({
    success: true,
    message: 'User is successfully logged out'
  })
})