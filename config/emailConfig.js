import nodemailer from "nodemailer";
import dns from "dns";
import "dotenv/config";

// Force IPv4 (VERY IMPORTANT for Render)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,               // Use TLS instead of 465
  secure: false,           // false for 587
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,  // 10s timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOTPEmail = async (email, otp, type = "login", name = "User") => {
  try {
    console.log("Attempting to send OTP to:", email);

    let subject = "";
    let messageBody = "";

    if (type === "register") {
      subject = `Welcome to the Family, ${name.split(" ")[0]}! 🍔`;
      messageBody = `
        <h2>Hey ${name},</h2>
        <p>Welcome to <strong>DEBEATS</strong>!</p>
        <div style="padding:20px;background:#f4f4f4;text-align:center;border-radius:12px;">
          <h1 style="letter-spacing:8px;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `;
    } else {
      subject = "Login Verification - DEBEATS";
      messageBody = `
        <h2>Secure Sign-In</h2>
        <p>Your OTP code:</p>
        <div style="padding:20px;background:#f4f4f4;text-align:center;border-radius:12px;">
          <h1 style="letter-spacing:8px;">${otp}</h1>
        </div>
      `;
    }

    const mailOptions = {
      from: `"DEBEATS Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family:Arial;padding:30px;">
          ${messageBody}
          <hr/>
          <p style="font-size:12px;color:#aaa;">
            © 2026 DEBEATS Food Delivery
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP Sent Successfully:", info.response);
    return info;

  } catch (error) {
    console.error("❌ NODEMAILER ERROR DETAILS:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    throw error;
  }
};