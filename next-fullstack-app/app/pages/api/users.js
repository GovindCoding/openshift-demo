'use strict'
const User = require("../../models/user.model.js");
const constants = require("../../config/constants.json");
const logger = require('../../config/logger.js');
const APIResponse = require('../../config/apiResponse');
const EmailService = require('../../config/sendEmail');
const randomize = require('randomatic');
const SERVICE_FILE_NAME = "Users :: "

export default (req, res) => {
    if(req.method === "POST"){
        const SERVICE_NAME = "saveUser() :: ";
        const reqObj = req.body;
        try {
            logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into saveUser().");
            reqObj.status = constants.STATUS_ACTIVE;
            reqObj.accountStatus = constants.EMAIL_SENT;
            reqObj.otp = randomize('0', 6).toString();
            reqObj.createdOn = new Date();

            User.create(new User(reqObj), (err, data) => {
                if (err) {
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while saving the User! Error:" + err);
                    return APIResponse.errorResponse(res, "Some error occurred while saving the User!", "USRE001");
                } else {
                    sendEmail(res, data.email, data.otp);
                    delete data.otp;
                    delete data.password;
                    logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User saved successfully!");
                    return APIResponse.successResponseWithData(res, "User saved successfully!", data, "USRS001");
                }
            });
        } catch (error) {
            console.error(error);
            logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong..");
            return APIResponse.errorResponse(res, "Something went wrong.", "USRE001");
        }
    } else if(req.method === "GET"){
        const SERVICE_NAME = "GetUser() :: ";
        try {
            logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into GetUser().");
            User.getUserById(req.params.id, (err, data) => {
                if (err) {
                    logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Some error occurred while get the User! Error:" + err);
                    return APIResponse.errorResponse(res, "Some error occurred while getting the User!", "USRE002");
                } else {
                    delete data.otp;
                    delete data.password;
                    logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "User getting successfully!");
                    return APIResponse.successResponseWithData(res, "User getting successfully!", data, "USRS001");
                }
            });
        } catch (error) {
            console.error(error);
            logger.error(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
            return APIResponse.errorResponse(res, "Something went wrong.", "USRE002");
        }
    }
}


async function sendEmail (res, email, otp) {
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
                        emailTemplate.email = email;
                        let emailContent = emailTemplate.email_content;
                        emailContent = emailContent.replace("{{OTP}}", otp);
                        emailTemplate.emailContent = emailContent;
                        const emailDoc = {
                            emailSetup: emailSetup,
                            emailBody: emailTemplate
                        }
                        await EmailService.sendEmail(emailDoc);
                    }
                });
            }
        });
    } catch (error) {
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Something went wrong.");
        return APIResponse.errorResponse(res, "Something went wrong.", "USRE011");
    }
}