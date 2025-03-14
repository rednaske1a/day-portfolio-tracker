
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, username, verificationLink) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Productivity Portfolio" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Productivity Portfolio!</h2>
          <p>Hello ${username},</p>
          <p>Thank you for registering. Please verify your email by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${verificationLink}</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Thanks,<br>The Productivity Portfolio Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { sendVerificationEmail };
