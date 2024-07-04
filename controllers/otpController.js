// otpController.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const crypto = require('crypto');

const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
const twilioClient = twilio(accountSid, authToken);

const otpStore = {};

const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex');
};

const sendOtp = async (email, mobileNumber, otp) => {
  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);

  // Send OTP via SMS
  await twilioClient.messages.create({
    body: `Your OTP code is ${otp}`,
    from: '+1234567890', // Your Twilio phone number
    to: mobileNumber,
  });
};

const storeOtp = (email, otp) => {
  otpStore[email] = { otp, timestamp: Date.now() };
};

const verifyOtp = (email, otp) => {
  const storedOtpData = otpStore[email];

  if (!storedOtpData) {
    throw new Error('OTP not found or expired');
  }

  const { otp: storedOtp, timestamp } = storedOtpData;

  if (Date.now() - timestamp > 5 * 60 * 1000) { // OTP is valid for 5 minutes
    delete otpStore[email];
    throw new Error('OTP expired');
  }

  if (storedOtp !== otp) {
    throw new Error('Invalid OTP');
  }

  delete otpStore[email];
  return true;
};

module.exports = {
  generateOtp,
  sendOtp,
  storeOtp,
  verifyOtp,
};
