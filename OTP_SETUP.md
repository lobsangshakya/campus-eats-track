# 📱 Real OTP Setup Guide

This guide will help you set up real SMS OTP functionality using Twilio.

## 🚀 Quick Start

### 1. Get Twilio Credentials

1. **Sign up for Twilio**: Go to [https://console.twilio.com/](https://console.twilio.com/)
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone Number (from Twilio Console > Phone Numbers > Manage > Active numbers)

### 2. Configure Environment

1. **Copy the example file**:
   ```bash
   cp server/env.example server/.env
   ```

2. **Edit `server/.env`** with your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_random_secret_here
   ```

### 3. Start Development Environment

**Option A: Use the startup script (Recommended)**
```bash
./start-dev.sh
```

**Option B: Manual startup**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

## 🔧 Features

### ✅ What's Included

- **Real SMS Delivery**: Uses Twilio to send actual SMS messages
- **Rate Limiting**: Prevents spam (5 OTP requests per 15 minutes per IP)
- **Security**: OTP expires in 5 minutes, max 3 verification attempts
- **Error Handling**: Comprehensive error messages for different scenarios
- **Auto Cleanup**: Expired OTPs are automatically removed
- **CORS Support**: Configured for development and production

### 📱 OTP Flow

1. **User enters phone number** → Validates format
2. **Clicks "Send OTP"** → Sends real SMS via Twilio
3. **User receives SMS** → 6-digit code with 5-minute expiry
4. **User enters OTP** → Verifies against stored code
5. **Success** → Logs in as student or admin

### 🛡️ Security Features

- **Rate Limiting**: 5 OTP requests per 15 minutes per IP
- **OTP Expiry**: Codes expire after 5 minutes
- **Attempt Limiting**: Max 3 verification attempts per OTP
- **Input Validation**: Phone number format validation
- **Error Handling**: Secure error messages

## 🎯 Testing

### Test Phone Numbers

- **Any valid phone number**: Will receive real SMS
- **Admin access**: Use `+911234567890` to login as admin
- **Student access**: Use any other valid number

### Expected Behavior

1. **Valid phone**: Receives SMS with 6-digit code
2. **Invalid phone**: Shows appropriate error message
3. **Wrong OTP**: Shows remaining attempts
4. **Expired OTP**: Prompts to request new OTP
5. **Rate limited**: Shows cooldown timer

## 🚨 Troubleshooting

### Common Issues

**"Failed to send OTP"**
- Check Twilio credentials in `server/.env`
- Verify phone number format
- Check Twilio account balance

**"Network error"**
- Ensure backend server is running on port 3001
- Check CORS configuration
- Verify API URL in frontend

**"Invalid phone number"**
- Use international format: `+1234567890`
- Remove spaces and special characters
- Ensure 10-15 digits total

### Debug Mode

Check server logs for detailed error information:
```bash
cd server
npm start
```

## 📊 API Endpoints

### Send OTP
```
POST /api/otp/send
Content-Type: application/json

{
  "phoneNumber": "+1234567890"
}
```

### Verify OTP
```
POST /api/otp/verify
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "otp": "123456"
}
```

## 🔄 Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Update CORS origins in `server.js`
- Use environment-specific Twilio credentials
- Set up proper logging and monitoring

### Security Considerations
- Use HTTPS in production
- Implement proper rate limiting
- Add request logging
- Monitor for abuse patterns

## 💰 Cost Considerations

- **Twilio SMS**: ~$0.0075 per SMS (varies by country)
- **Free Trial**: $15 credit for new accounts
- **Rate Limiting**: Prevents excessive usage

## 🆘 Support

If you encounter issues:
1. Check the server logs
2. Verify Twilio credentials
3. Test with a known working phone number
4. Check network connectivity

---

**🎉 You're all set! Your app now sends real SMS OTPs to users' phones.**
