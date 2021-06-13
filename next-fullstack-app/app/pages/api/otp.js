'use strict'

const User = require("../../models/user.model");
const constants = require("../../config/constants.json")
const logger = require('../../config/logger.js');
const APIResponse = require('../../config/apiResponse')
const SERVICE_FILE_NAME = "Users :: "

export default (req, res) => {
    if(req.method === "POST"){
        const SERVICE_NAME = "verifyEmail() :: ";
        const reqObj = req.body;
        console.log(JSON.stringify(reqObj))
        try {
            logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into verify email.");
            User.getUserById(parseInt(reqObj.userId), (err, user) => {
                if (err) {
                    console.log(JSON.stringify(err));
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error retrieving user with email!");
                    return APIResponse.errorResponse(res, "Error retrieving user with email " + parseInt(reqObj.userId), "USRE005");
                } else {
                    if (reqObj.otp === user.otp) {
                        user.accountStatus = constants.EMAIL_VERIFIED;
                        user.modifiedOn = new Date();
                        user.otp = null;
                        User.verifyEmail(parseInt(reqObj.userId), user, (err, data) => {
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
            console.log(error);
            logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Error in get user by Id.");
            return APIResponse.errorResponse(res, "Something went wrong.", "USRE003");
        }
    }
};