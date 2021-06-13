'use strict'
const nodemailer = require('nodemailer');
const logger=require('./logger')
const SERVICE_FILE_NAME = "SendEmail :: ";

exports.sendEmail = (emailDoc) => {
    const SERVICE_NAME = "sendEmail() :: ";
    logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into sendEmail().");
    try {
        let emailSetup = `smtps://` + emailDoc.emailSetup.user_name + `:` + emailDoc.emailSetup.password + `@` + emailDoc.emailSetup.smtp_host;
        let mailTransport = nodemailer.createTransport(emailSetup);

        const mailOptions = {
            from: `Support <${emailDoc.emailSetup.user_name}>`,
            to: emailDoc.emailBody.email
        };
        mailOptions.html = `<p>${emailDoc.emailBody.emailContent}</p>`;
        mailOptions.subject = emailDoc.emailBody.email_subject;
        if (emailDoc.emailBody.attachments) {
            mailOptions.attachments = emailDoc.emailBody.attachments;
        }
        logger.info(SERVICE_FILE_NAME + SERVICE_NAME + "Email sent successfully.");
        return mailTransport.sendMail(mailOptions);
    } catch (error) {
        logger.error(SERVICE_FILE_NAME + SERVICE_NAME + 'Error in Sending email. Error:', error);
        return ({
            status: "ERROR",
            message: "Error in Sending email"
        });
    }
};