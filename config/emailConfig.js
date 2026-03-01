import nodemailer from 'nodemailer';
import 'dotenv/config';

// 🚀 RENDER-SPECIFIC STABLE CONFIG
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // 587 ke liye false hona chahiye
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-digit App Password
    },
    family: 4, // IPv6 error ko rokne ke liye
    
    // Timeouts ko badha diya hai taaki Render ko connect hone ka poora mauka mile
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
    
    tls: {
        rejectUnauthorized: false, // SSL certificates issues ignore karega
        minVersion: 'TLSv1.2'
    }
});

export const sendOTPEmail = async (email, otp, type = 'login', name = 'User') => {
    try {
        // ... (Aapka subject aur messageBody logic same rahega)

        const mailOptions = {
            from: `"DEBEATS Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: type === 'register' ? `Welcome, ${name.split(' ')[0]}! 🍔` : "Login Verification - DEBEATS",
            html: `Your OTP is: ${otp}` // Just for testing, use your full HTML later
        };

        console.log("Attempting to send OTP to:", email);
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ SUCCESS: Email Sent | Response:", info.response);
        return info;
    } catch (error) {
        console.error("❌ NODEMAILER ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        throw error;
    }
};