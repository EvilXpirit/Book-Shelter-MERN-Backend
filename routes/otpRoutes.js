// otpRoutes.js
const express = require('express');
const router = express.Router();
const { generateOtp, sendOtp, storeOtp, verifyOtp } = require('./otpController');

router.post('/send-otp', async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    const otp = generateOtp();
    await sendOtp(email, mobileNumber, otp);
    storeOtp(email, otp);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    res.status(500).send('Error sending OTP: ' + error.message);
  }
});

router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    verifyOtp(email, otp);
    res.status(200).send('OTP verified successfully');
  } catch (error) {
    res.status(400).send('Error verifying OTP: ' + error.message);
  }
});

module.exports = router;
