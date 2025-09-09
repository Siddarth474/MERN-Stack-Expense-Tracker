import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAcessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access & refresh token");
    }
}

const registerUser = async (req,res) => {
    const {fullname, username, email, password} = req.body;

    if([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) {
        throw new ApiError(409, 'User already exist!');
    }

    const user = await User.create({
        fullname, 
        username : username.toLowerCase(),
        email,
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registring user!!!");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, user, "User registered successfully!"));
}

const loginUser = async (req, res) => { 
    const {email, password} = req.body;

    if(!email && !password) {
        throw new ApiError(400, "Password & Email required!");
    }

    const user = await User.findOne({
        $or: [{email}, {password}]
    });

    if(!user) {
        throw new ApiError(403, "User not found!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401, "Password is invalid");

    const {accessToken , refreshToken} = await generateAcessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    };


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "Logged in successfully"));

}

const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));

}

const changeCurrentPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
}

const getcurrentUser = async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
}

const updateAccountDetails = async (req, res) => {
    const {fullname, email, username} = req.body;

    if(!fullname || !email || !username) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                username,
                email
            }
        }
    ).select("-password");

    if(!user) throw new ApiError(400, "Account does not found");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account updated successfully"));
}

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getcurrentUser,
    updateAccountDetails
}