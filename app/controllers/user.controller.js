'use strict'
const User = require("../models/user.model.js");
const APIResponse = require("../utils/apiResponse.js");
const constants = require("../utils/constants.json");
const emailService = require("../utils/sendEmail.js");
const logger = require('../utils/logger.js');
const jwt = require('jsonwebtoken');
const randomize = require('randomatic');
const SERVICE_FILE_NAME = "user.controller :: ";

exports.jwtSign = (payload) => {
    const token = jwt.sign(payload, constants.SECRET_KEY, { expiresIn: '900s' });
    return token;
}

// Login a User
exports.login = (req, res) => {
    const SERVICE_NAME = "login() :: ";
    var reqObj = req.body;
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into login().");
        // Save User in the database
        User.login(new User(reqObj), (err, user) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while login user! Error:" + error);
                return APIResponse.errorResponse(res, "Some error occurred while creating the User!", "USRE002");
            } else {
                delete user.password;
                user.accessToken = this.jwtSign({ username: user.email, userId: user.id, phone: user.phone });
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User login successfully!");
                return APIResponse.successResponseWithData(res, "User login successfully!", user, "USRS001");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong! Error:" + error);
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE003");
    }
};

// Login a User
exports.verifyEmail = (req, res) => {
    const SERVICE_NAME = "verifyEmail() :: ";
    const reqObj = req.body;
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into verify email.");
        // Verify User Email
        User.getUserById(req.params.userId, (err, user) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error retrieving user with email!");
                return APIResponse.errorResponse(res, "Error retrieving user with email " + req.params.userId, "USRE005");
            } else {
                if (reqObj.otp === user.otp) {
                    user.accountStatus = constants.EMAIL_VERIFIED;
                    user.modifiedOn = new Date();
                    user.otp = null;
                    User.verifyEmail(req.params.userId, user, (err, data) => {
                        if (err) {
                            logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while verifying email address!. Error:" + JSON.stringify(err));
                            return APIResponse.errorResponse(res, "Some error occurred while verifying email address!", "USRE002");
                        } else {
                            logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Email verified successfully!");
                            return APIResponse.successResponse(res, "Email verified successfully!", "USRS001");
                        }
                    });
                } else {
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Otp is not valid!!");
                    return APIResponse.errorResponse(res, "Otp is not valid!", "USRE003");
                }
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error in get user by Id.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE003");
    }
};


// Save a new User
exports.saveUser = (req, res) => {
    const SERVICE_NAME = "saveUser() :: ";
    const reqObj = req.body;
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into saveUser().");
        reqObj.accountStatus = constants.EMAIL_SENT;
        reqObj.otp = randomize('0', 6).toString();
        reqObj.createdOn = new Date();

        User.create(new User(reqObj), (err, data) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while creating the User! Error:" + err);
                return APIResponse.errorResponse(res, "Some error occurred while creating the User!", "USRE002");
            } else {
                this.sendEmail(res, data);
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User saved successfully!");
                return APIResponse.successResponseWithData(res, "User saved successfully!", data, "USRS001");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error in get user by Id.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE003");
    }
};

// Retrieve all Users from the database.
exports.getAllUsers = (req, res) => {
    const SERVICE_NAME = "getAllUsers() :: ";
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into getAllUsers().");
        User.getAll((err, data) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while retrieving users. Error:" + JSON.stringify(err));
                return APIResponse.errorResponse(res, "Some error occurred while retrieving users.", "USRE003");
            } else {
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "All Users get successfully!");
                return APIResponse.successResponseWithData(res, "All Users get successfully!", data, "USRS002");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE003");
    }
};

// Find a single User with a userId
exports.getUserById = (req, res) => {
    const SERVICE_NAME = "getUserById() :: ";
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into getUserById().");
        User.getUserById(req.params.userId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Not found User with id. Error:" + JSON.stringify(err));
                    return APIResponse.notFoundResponse(res, `Not found User with id ${req.params.userId}.`, "USRE004")
                } else {
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error retrieving User with id.");
                    return APIResponse.errorResponse(res, "Error retrieving User with id " + req.params.userId, "USRE005");
                }
            } else {
                delete data.password;
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User records get successfully!");
                return APIResponse.successResponseWithData(res, "User records get successfully!", data, "USRS003");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE005");
    }
};

// Update a User identified by the userId in the request
exports.updateUser = (req, res) => {
    const SERVICE_NAME = "updateUser() :: ";
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Enteirng into updateUser().");
        User.updateById(req.params.userId, new User(req.body), (err, data) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error updating User with id.");
                return APIResponse.errorResponse(res, "Error updating User with id " + req.params.userId, "USRE008");
            } else {
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User records get successfully!");
                return APIResponse.successResponseWithData(res, "User records get successfully!", data, "USRS004");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE005");
    }
};

// Delete a User with the specified userId in the request
exports.deleteUser = (req, res) => {
    try {
        User.remove(req.params.userId, (err, data) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Could not delete User with id. Error:" + JSON.stringify(err))
                return APIResponse.errorResponse(res, "Could not delete User with id " + req.params.userId, "USRE010");
            } else {
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User was deleted successfully!");
                return APIResponse.successResponseWithData(res, "User was deleted successfully!", data, "USRS005");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE011");
    }
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    const SERVICE_NAME = "deleteAll() :: ";
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into deleteAll user.");
        User.removeAll((err, data) => {
            if (err) {
                logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while removing all users. Error:" + JSON.stringify(err));
                return APIResponse.errorResponse(res, "Some error occurred while removing all users.", "USRE011");
            } else {
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "All Users were deleted successfully!");
                return APIResponse.successResponseWithData(res, "All Users were deleted successfully!", data, "USRS006");
            }
        });
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE011");
    }
};

exports.sendEmail = async(res, user) => {
    const SERVICE_NAME = "sendEmail() :: ";
    try {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into send email.");
        User.findEmailParams('email', async(err, emailSetup) => {
            if (err) {
                logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Error retrieving User with id. Error:" + JSON.stringify(err));
                return APIResponse.errorResponse(res, "Error retrieving User with id " + req.params.userId, "USRE005");
            } else {
                User.findEmailTemplate('send_otp', async(err, emailTemplate) => {
                    if (err) {
                        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Error retrieving User with id. Error:" + JSON.stringify(err));
                        return APIResponse.errorResponse(res, "Error retrieving User with id " + req.params.userId, "USRE005");
                    } else {
                        emailTemplate.email = user.email;
                        let emailContent = emailTemplate.email_content;
                        emailContent = emailContent.replace("{{OTP}}", user.otp);
                        emailTemplate.emailContent = emailContent;
                        const emailDoc = {
                            emailSetup: emailSetup,
                            emailBody: emailTemplate
                        }
                        await emailService.sendEmail(emailDoc);
                    }
                });
            }
        });
    } catch (error) {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE011");
    }
}