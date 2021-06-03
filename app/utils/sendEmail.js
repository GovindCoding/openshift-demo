const nodemailer = require('nodemailer');
const SERVICE_FILE_NAME = "SendEmail :: ";

exports.sendEmail = (emailDoc) => {
    const SERVICE_NAME = "sendEmail() :: ";
    console.info(SERVICE_FILE_NAME + SERVICE_NAME + "Entering into sendEmail(). " + JSON.stringify(emailDoc));
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
        // console.log("mailOptions :"+JSON.stringify(mailOptions));
        console.log(SERVICE_FILE_NAME + SERVICE_NAME + "Email sent successfully:" + JSON.stringify(mailOptions));
        return mailTransport.sendMail(mailOptions);
    } catch (error) {
        console.error(SERVICE_FILE_NAME + SERVICE_NAME + 'Error in Sending email. Error:', error);
        return ({
            status: "ERROR",
            message: "Error in Sending email"
        });
    }
};



// <!DOCTYPE html> <html> <title>Verify OTP</title>  <head></head> <body> <table style="width: 100%; border: none; margin: 0 auto; background-color: #E8EFFD; border-spacing: 0px;"> <tbody> <tr><td><table style="width: 600px; border: none; margin: 0 auto; background-color: #fff; border-spacing: 0px;">	<tbody>	<tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 0px;"><table style="width: 100%; text-align: left; border-spacing: 0px; padding-left: 20px;"><tbody><tr> <td colspan="2"><img src="{{APP_LOGO}}" style="width: auto; height: 50px;" /><p style="font-size: 12px; font-family: 'Montserrat', sans-serif; margin: 0px 0px 10px 0px;">Verify OTP</p></td></tr></tbody></table></td></tr><tr><td colspan="2" style="padding: 25px 30px;"><p style="font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 24px; margin: 10px 0px 10px 0px;">	Dear user, {{OTP}} is your OTP to proceed with Registration. It is valid for 4 hrs. Do not share your OTP with anyone. </p></td></tr><tr><td colspan="2" style="padding: 10px 30px;"><p style="font-family: 'Montserrat', sans-serif; font-size: 14px; margin: 5px 0px 5px 0px; font-weight: 600;">Support Team</p></td></tr></tbody></table> </td></tr></tbody></table></body></html>