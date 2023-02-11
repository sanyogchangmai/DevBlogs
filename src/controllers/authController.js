import User from "../models/userModel.js";
import logger from "../logger/logger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// * @desc - SIGNUP CONTROLLER
// * @method - POST
// * @route - /auth/signup
const signUpUser = async (req, res) => {
    const {username, email, password} = req.body;

    // ! handle missing data
    if (!username || !email || !password) {
        logger.info("Missing data. All data not provided during signup.");
        res.status(400).json({
            status: "error",
            code: 400,
            message: "Data missing, please provide all fields.",
        });
    }

    // ! check if user already exists
    const user = await User.findOne({username: username});
    if (user) {
        res.status(409).json({
            status: "error",
            code: 409,
            message: "User already exists.",
        });
    } else {
        // ! hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // ! create new user
        const userCredentials = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        });

        // ! save user data
        try {
            const result = await userCredentials.save();
            logger.info("User account created successfully.");
            res.status(201).json({
                status: "success",
                code: 201,
                message: "User account created successfully.",
                data: {
                    id: result._id,
                    username: result.username,
                    email: result.email,
                },
            });
        } catch (err) {
            logger.error("Error occured during signup.");
            logger.error(err);
            res.status(500).json({
                status: "error",
                code: 500,
                message: "Failed to create user account. Try again.",
                data: err,
            });
        }
    }
};

// * @desc - LOGIN CONTROLLER
// * @method - POST
// * @route - /auth/login
const loginUser = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        logger.info("Missing data. All data not provided during login.");
        res.status(400).json({
            status: "error",
            message: "Data missing, please provide all fields.",
        });
    }

    // ! check if user exists
    const user = await User.findOne({username: username});

    if (user) {
        // ! check if password matches
        if (bcrypt.compareSync(password, user.password) == true) {
            logger.info("User password match.");
            const token = generateToken(user._id);
            res.status(200).json({
                status: "success",
                code: 200,
                message: "User authenticated successfully.",
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    access_token: token,
                },
            });
        } else {
            logger.info("Password do not match.");
            res.status(401).json({
                status: "error",
                code: 401,
                message: "Wrong password.",
            });
        }
    } else {
        logger.info("No user found with this username.");
        res.status(404).json({
            status: "error",
            message: "No user found with this username.",
        });
    }
};

// * Logout user
const logOutUser = (req, res) => {
    res.clearCookie("access_token").status(200).json({
        status: "success",
        code: 200,
        message: "Logged out successfully.",
    });
};

// * @desc - USER DATA CONTROLLER
// * @method - GET
// * @route - /auth/user/data
const getUser = async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findOne({_id: userId});
        console.log(user);
        if (user) {
            logger.info("User data fetched successfully");
            res.status(200).json({
                status: "success",
                code: 200,
                message: "User data fetched successfully.",
                data: {
                    username: user.username,
                    email: user.email,
                },
            });
        } else {
            logger.info("No user found with this id.");
            res.status(404).json({
                status: "error",
                code: 404,
                message: "No user found with this id.",
            });
        }
    } catch (err) {
        logger.error("Failed to fetch user data.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch user data.",
        });
    }
};

// ! ---------- FUNCTIONS ----------
// * Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

export {
    signUpUser,
    loginUser,
    logOutUser,
    getUser,
};
