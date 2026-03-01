import nodemailer from 'nodemailer';
import 'dotenv/config';

// Transporter settings ko thoda optimize kiya hai cloud deployment ke liye
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // SSL ke liye 465 best hai Render par
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Make sure this is a 16-digit APP PASSWORD
    },
    // Ye line important hai agar server connection reject kare
    tls: {
        rejectUnauthorized: false
    }
});

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
                        Welcome to <strong>DEBEATS</strong>! Use the code below to verify your account.
                    </p>
                    <div style="background: linear-gradient(135deg, #fff5f2 0%, #fff0eb 100%); border-radius: 16px; padding: 35px; text-align: center; margin: 35px 0; border: 2px solid #ff4c24;">
                        <h1 style="color: #1a1a1a; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: 'Courier New', Courier, monospace; font-weight: 900;">${otp}</h1>
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
                        <p style="font-size: 13px; color: #cccccc; text-align: center;">© 2026 DEBEATS Food Delivery</p>
                    </div>
                </div>
            `
        };

        // Render logs mein check karne ke liye success message
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent: " + info.response);
        return info;

    } catch (error) {
        // Agar fail hota hai toh Render logs mein exact error dikhega
        console.error("❌ Nodemailer Error: ", error.message);
        throw error; 
    }
};