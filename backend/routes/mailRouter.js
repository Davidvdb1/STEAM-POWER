import express from 'express';
import transporter from '../mail.js';
import { userService } from '../service/userService.js';
import mailDb from '../domain/data-access/mail.db.js';
import crypto from 'crypto';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';

const mailRouter = express.Router();

mailRouter.post('/send-recover-mail', async (req, res, next) => {
    try {
        const toEmail = req.body.email;

        const user = await userService.getUserByEmail(toEmail);
        if (!user) {
            throw new CustomException(ErrorEnum.DoesntExist, `User with email ${toEmail} doesn't exist`);
        }

        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');

        // Set the expiration time to 15 minutes from now
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);

        // Store the token in the database associated with the user's email
        await mailDb.setPasswordReset(toEmail, token, expires);

        let mailOptions = {
            from: 'twaleuvennoreply@gmail.com',
            to: toEmail,
            subject: 'Password Reset',
            text: `You have 15 minutes for resetting your password.\nClick the link to reset your password: http://localhost/frontend/index.html?token=${token}`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);

        res.status(200).json({ message: 'Email sent: ' + info.response });
    } catch (error) {
        next(error);
    }
});

export default mailRouter;