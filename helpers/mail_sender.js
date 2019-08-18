'use strict';
const nodemailer = require('nodemailer');

/*
*** Email helper responsable for sending emails ex: complete registration email , forget password email ... 
*/

module.exports = {
    completeRegistarion: async (data) => { // this method is responsable to only send complete registration message

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS 
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '[Matcha]', // sender address
            to: data.email, // list of receivers
            subject: '[MATCHA] Confirm your account', // Subject line
            html: `
            <h1>Please click on the link to complete your registration</h1>
            <br >
            <a href="http://localhost:3000/users/completeRegistration/${data.email}/${data.verify_email_hash}">
            Click here
            </a>
            ` // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    },

    forgetPassword: async (data) => { // this method is responsable to only send a link to re-initialize account password

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS 
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '[Matcha]', // sender address
            to: data.email, // list of receivers
            subject: '[MATCHA] Account recovery', // Subject line
            html: `
            <h1>Please click on the link to re-initialize your password</h1>
            <br >
            <a href="http://localhost:3000/users/reinitializePassword/${data.token}">
            Click here
            </a>
            ` // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
}