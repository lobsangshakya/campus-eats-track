const express = require('express');
const router = express.Router();
const otpService = require('../services/otpService');

// Rate limiting for OTP endpoints (more restrictive)
const otpLimiter = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP requests per windowMs
  message: {
    error: 'Too many OTP requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Send OTP endpoint
router.post('/send', otpLimiter, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // Clean and validate phone number format
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    // Format phone number for international use
    const formattedPhone = cleanedPhone.startsWith('+') 
      ? cleanedPhone 
      : `+${cleanedPhone}`;

    // Send OTP
    const result = await otpService.sendOTP(formattedPhone);

    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: formattedPhone,
        expiresIn: '5 minutes'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send OTP'
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify OTP endpoint
router.post('/verify', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }

    // Clean phone number
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanedPhone.startsWith('+') 
      ? cleanedPhone 
      : `+${cleanedPhone}`;

    // Verify OTP
    const result = await otpService.verifyOTP(formattedPhone, otp);

    if (result.success) {
      res.json({
        success: true,
        message: 'OTP verified successfully',
        phoneNumber: formattedPhone
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Invalid OTP'
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
