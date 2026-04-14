import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Resume AI <noreply@resumeai.com>',
    to: email,
    subject: '✅ Verify Your Email - Resume AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Resume AI</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Professional Resume Builder & Analyzer</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${name}! 🎉</h2>
          <p style="color: #6b7280;">Please verify your email address to get started with your professional resume journey.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `
    });
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
  }
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Resume AI <noreply@resumeai.com>',
    to: email,
    subject: '🔑 Reset Your Password - Resume AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Resume AI</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #6b7280;">Hi ${name}, we received a request to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
        </div>
      </div>
    `
    });
  } catch (err) {
    console.error('Failed to send password reset email:', err.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
    to: email,
    subject: '🚀 Welcome to Resume AI - Let\'s Build Your Dream Resume!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Welcome to Resume AI! 🎊</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 12px;">
          <h2>Hi ${name},</h2>
          <p>You're all set! Here's what you can do:</p>
          <ul>
            <li>🏗️ Build professional resumes with 10+ templates</li>
            <li>🤖 Get AI-powered resume analysis & ATS scoring</li>
            <li>📊 Compare your resume against job descriptions</li>
            <li>📄 Export to PDF, Word, or share online</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
};
