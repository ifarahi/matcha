'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
module.exports = {
    completeRegistarion: async (data) => {

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
    }
}