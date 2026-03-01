import nodemailer from 'nodemailer';
import 'dotenv/config';

// 🚀 COMPLETE FIX FOR RENDER (IPv4 Force + SSL)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, // Port 465 ke liye hamesha true
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-digit Google App Password
    },
    // 🔥 YE SABSE ZAROORI LINE HAI: IPv6 error (ENETUNREACH) ko rokne ke liye
    family: 4, 
    
    // Connection stability settings
    connectionTimeout: 20000, // 20 seconds tak wait karega
    greetingTimeout: 20000,
    socketTimeout: 20000,
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
});

/**
 * Sends an OTP Email for Registration or Login
 * @param {string} email - Recipient's email
 * @param {string} otp - The 6-digit code
 * @param {string} type - 'register' or 'login'
 * @param {string} name - User's name
 */
export const sendOTPEmail = async (email, otp, type = 'login', name = 'User') => {
    try {
        let subject = "";
        let messageBody = "";

        if (type === 'register') {
            subject = `Welcome to the Family, ${name.split(' ')[0]}! 🍔`;
            messageBody = `
                <div style="padding: 10px 0; text-align: left;">
                    <h2 style="color: #333; font-size: 26px; margin-bottom: 15px; font-weight: 800;">Hey ${name},</h2>
                    <p style="font-size: 17px; color: #444; line-height: 1.8;">
                        Welcome to <strong>DEBEATS</strong>! We're absolutely thrilled to have you. 
                    </p>
                    <p style="font-size: 17px; color: #444; line-height: 1.8;">
                        Use the secure code below to verify your account and start your first order!
                    </p>
                    <div style="background: linear-gradient(135deg, #fff5f2 0%, #fff0eb 100%); border-radius: 16px; padding: 35px; text-align: center; margin: 35px 0; border: 2px solid #ff4c24;">
                        <p style="margin: 0 0 12px 0; color: #ff4c24; font-weight: 800; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Your Exclusive Access Code</p>
                        <h1 style="color: #1a1a1a; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: 'Courier New', Courier, monospace; font-weight: 900;">${otp}</h1>
                        <p style="margin: 15px 0 0 0; color: #999; font-size: 13px;">This code expires in 5 minutes for your security.</p>
                    </div>
                </div>
            `;
        } else {
            subject = "Login Verification - DEBEATS";
            messageBody = `
                <div style="padding: 10px 0;">
                    <h2 style="color: #333; font-size: 22px; font-weight: 700;">Secure Sign-In</h2>
                    <p style="font-size: 16px; color: #555;">Please enter the following verification code to access your DEBEATS account:</p>
                    <div style="background-color: #f8f8f8; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; border: 1px solid #eee;">
                        <h1 style="color: #333; font-size: 40px; letter-spacing: 8px; margin: 0; font-weight: 800;">${otp}</h1>
                    </div>
                </div>
            `;
        }

        const mailOptions = {
            from: `"DEBEATS Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="background-color: #f6f6f6; padding: 50px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 45px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
                        ${messageBody}
                        <div style="margin-top: 45px; padding-top: 25px; border-top: 1px solid #f0f0f0; text-align: center;">
                            <p style="font-size: 13px; color: #cccccc; margin: 0;">
                                © 2026 DEBEATS Food Delivery. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // Attempting to send
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ SUCCESS: OTP Sent to " + email + " | Response: " + info.response);
        return info;

    } catch (error) {
        // Detailed error logging for Render dashboard
        console.error("❌ NODEMAILER ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        throw error; 
    }
};