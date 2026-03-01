import nodemailer from 'nodemailer';
import 'dotenv/config';

// 🚀 COMPLETE FIX FOR RENDER (Forcing IPv4 to stop ENETUNREACH)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, // Port 465 uses direct SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your 16-digit Google App Password
    },
    // 🔥 YE SABSE ZAROORI LINE HAI: IPv6 error ko khatam karne ke liye
    family: 4, 
    
    // Connection stability for cloud environments
    connectionTimeout: 20000, 
    greetingTimeout: 20000,
    socketTimeout: 20000,
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
});

/**
 * Sends an OTP Email
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
                    <div style="background: linear-gradient(135deg, #fff5f2 0%, #fff0eb 100%); border-radius: 16px; padding: 35px; text-align: center; margin: 35px 0; border: 2px solid #ff4c24;">
                        <p style="margin: 0 0 12px 0; color: #ff4c24; font-weight: 800; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Your Verification Code</p>
                        <h1 style="color: #1a1a1a; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: 'Courier New', Courier, monospace; font-weight: 900;">${otp}</h1>
                        <p style="margin: 15px 0 0 0; color: #999; font-size: 13px;">This code expires in 5 minutes.</p>
                    </div>
                </div>
            `;
        } else {
            subject = "Login Verification - DEBEATS";
            messageBody = `
                <div style="padding: 10px 0;">
                    <h2 style="color: #333; font-size: 22px; font-weight: 700;">Secure Sign-In</h2>
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
                <div style="background-color: #f6f6f6; padding: 50px 0; font-family: Arial, sans-serif;">
                    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 45px;">
                        ${messageBody}
                        <div style="margin-top: 45px; padding-top: 25px; border-top: 1px solid #f0f0f0; text-align: center;">
                            <p style="font-size: 13px; color: #cccccc;">© 2026 DEBEATS Food Delivery</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ SUCCESS: OTP Sent to " + email);
        return info;

    } catch (error) {
        console.error("❌ NODEMAILER ERROR:", error.message);
        throw error; 
    }
};