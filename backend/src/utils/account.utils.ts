import crypto from "crypto";
import { create } from "domain";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ramosnash0519@gmail.com',
        pass: 'awzrykxkwodvfnfx'
    }
});

export const hashPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export const emailVerificationLogic = async (email: string, code: string) => {
    const info = await transporter.sendMail({
        from: '"MelanomaTracker Support" <ramosnash0519@gmail.com>', // friendlier "from" name
        to: email,
        subject: 'Verify your MelanomaTracker account',
        text: `Hello,

Thanks for signing up with MelanomaTracker!

Here’s your verification code: ${code}

Please enter this code in the app to complete your registration.

If you did not request this verification, feel free to ignore this email.

Thank you,
The MelanomaTracker Team`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2>Welcome to MelanomaTracker!</h2>
                <p>Here’s your verification code:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${code}</p>
                <p>Please enter this code in the app to complete your signup.</p>
                <br/>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <br/>
                <p style="font-size: 12px; color: #777;">
                  You received this email because you registered on MelanomaTracker.
                </p>
            </div>
        `
    });

    console.log('Email sent:', info.messageId);
    return true;
};


export function generateSimpleVerificationCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz123456789'; // no 0 to avoid confusion
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const sendCredentialsToEmail = async(email: string, username: string) => {
    const info = await transporter.sendMail({
        from: '"MelanomaTracker Support" <ramosnash0519@gmail.com>', // friendlier "from" name
        to: email,
        subject: 'Verify your MelanomaTracker account',
        text: `Hello,

Thanks for signing up with MelanomaTracker!

You can use this credentials to log in.

If you did not create any account, feel free to ignore this email.

Thank you,
The MelanomaTracker Team`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2>Welcome to MelanomaTracker!</h2>
                <p>Your email has been verified</p>
                <p style="font-size: 24px; font-weight: bold; color: #007BFF;">Use this username: ${username}</p>
                <br/>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <br/>
                <p style="font-size: 12px; color: #777;">
                  You received this email because you registered on MelanomaTracker.
                </p>
            </div>
        `
    });

    console.log('Email sent:', info.messageId);
    return true;
};