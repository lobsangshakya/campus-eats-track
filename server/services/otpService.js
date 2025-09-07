const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

// OTP configuration
const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  maxAttempts: 3
};

/**
 * Generate a random OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via SMS using Twilio
 */
async function sendOTP(phoneNumber) {
  try {
    // Check if phone number already has a valid OTP
    const existingOTP = otpStorage.get(phoneNumber);
    if (existingOTP && existingOTP.attempts < OTP_CONFIG.maxAttempts) {
      const timeLeft = Math.ceil((existingOTP.expiresAt - Date.now()) / 1000);
      if (timeLeft > 0) {
        return {
          success: false,
          error: `Please wait ${timeLeft} seconds before requesting a new OTP`
        };
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + (OTP_CONFIG.expiryMinutes * 60 * 1000);

    // Store OTP with metadata
    otpStorage.set(phoneNumber, {
      code: otp,
      expiresAt: expiresAt,
      attempts: 0,
      createdAt: Date.now()
    });

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your Campus Eats verification code is: ${otp}. This code expires in ${OTP_CONFIG.expiryMinutes} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`OTP sent to ${phoneNumber}, Message SID: ${message.sid}`);

    return {
      success: true,
      messageSid: message.sid,
      expiresIn: OTP_CONFIG.expiryMinutes * 60
    };

  } catch (error) {
    console.error('Twilio SMS error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return {
        success: false,
        error: 'Invalid phone number format'
      };
    } else if (error.code === 21614) {
      return {
        success: false,
        error: 'Phone number is not a valid mobile number'
      };
    } else if (error.code === 21408) {
      return {
        success: false,
        error: 'Permission to send SMS to this number denied'
      };
    }

    return {
      success: false,
      error: 'Failed to send SMS. Please try again.'
    };
  }
}

/**
 * Verify OTP
 */
async function verifyOTP(phoneNumber, inputOTP) {
  try {
    const storedOTP = otpStorage.get(phoneNumber);

    if (!storedOTP) {
      return {
        success: false,
        error: 'No OTP found for this phone number. Please request a new OTP.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        error: 'OTP has expired. Please request a new OTP.'
      };
    }

    // Check if max attempts exceeded
    if (storedOTP.attempts >= OTP_CONFIG.maxAttempts) {
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.'
      };
    }

    // Increment attempts
    storedOTP.attempts++;

    // Verify OTP
    if (storedOTP.code === inputOTP) {
      // OTP is correct, remove it from storage
      otpStorage.delete(phoneNumber);
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      // Update attempts in storage
      otpStorage.set(phoneNumber, storedOTP);
      
      const remainingAttempts = OTP_CONFIG.maxAttempts - storedOTP.attempts;
      return {
        success: false,
        error: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      };
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: 'Verification failed. Please try again.'
    };
  }
}

/**
 * Clean up expired OTPs (call this periodically)
 */
function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [phoneNumber, otpData] of otpStorage.entries()) {
    if (now > otpData.expiresAt) {
      otpStorage.delete(phoneNumber);
    }
  }
}

// Clean up expired OTPs every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  sendOTP,
  verifyOTP,
  cleanupExpiredOTPs
};
