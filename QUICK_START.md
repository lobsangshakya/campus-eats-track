# 🚀 Quick Start Guide

## Ready to Use! 

Your Campus Eats app with **real SMS OTP** is now ready. Follow these simple steps:

### 1. Get Twilio Credentials (2 minutes)
1. Go to [console.twilio.com](https://console.twilio.com/)
2. Sign up/login and get:
   - Account SID
   - Auth Token  
   - Phone Number (from Phone Numbers section)

### 2. Configure Environment (1 minute)
```bash
cp server/env.example server/.env
```
Edit `server/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=3001
NODE_ENV=development
```

### 3. Start the App (30 seconds)
```bash
./start-dev.sh
```

### 4. Test It! 
- Open http://localhost:5173
- Enter any valid phone number
- Receive real SMS with OTP code
- Login as student or admin

## 🎯 Test Numbers
- **Admin**: `+911234567890` 
- **Student**: Any other valid number

## ✅ What Works Now
- ✅ Real SMS delivery via Twilio
- ✅ OTP verification with security
- ✅ Student dashboard with live data
- ✅ Admin dashboard with analytics
- ✅ Rate limiting and error handling
- ✅ Responsive design with themes

## 🆘 Need Help?
- Check [OTP_SETUP.md](./OTP_SETUP.md) for detailed setup
- Check [README.md](./README.md) for full documentation
- Ensure Twilio credentials are correct
- Make sure both servers are running

**🎉 You're all set! Your app now sends real SMS OTPs!**
