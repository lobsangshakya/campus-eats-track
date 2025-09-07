# 🍽️ Campus Eats - University Mess Portal

A modern, real-time university mess/canteen management system with SMS OTP authentication.

## ✨ Features

- **Real SMS OTP Authentication** - Uses Twilio for actual SMS delivery
- **Student Dashboard** - Live crowd monitoring, table booking, meal schedules
- **Admin Dashboard** - Real-time analytics, threshold management, activity monitoring
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Toggle between themes
- **Real-time Updates** - Live data updates every few seconds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Twilio account (for SMS OTP)

### 1. Clone and Install
```bash
git clone <your-repo>
cd campus-eats-track
npm install
cd server && npm install && cd ..
```

### 2. Configure Twilio
1. Get credentials from [Twilio Console](https://console.twilio.com/)
2. Copy environment file:
   ```bash
   cp server/env.example server/.env
   ```
3. Edit `server/.env` with your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=3001
   NODE_ENV=development
   ```

### 3. Start Development
```bash
# Option 1: Use startup script (recommended)
./start-dev.sh

# Option 2: Manual start
npm run start:full

# Option 3: Separate terminals
npm run backend:dev  # Terminal 1
npm run dev          # Terminal 2
```

### 4. Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📱 Testing OTP

- **Any valid phone number**: Will receive real SMS
- **Admin access**: Use `+911234567890` to login as admin
- **Student access**: Use any other valid number

## 🛠️ Available Scripts

```bash
npm run dev          # Start frontend only
npm run backend      # Start backend only
npm run start:full   # Start both frontend and backend
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
campus-eats-track/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                # Backend Express server
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── server.js         # Main server file
├── public/               # Static assets
└── start-dev.sh         # Development startup script
```

## 🔧 API Endpoints

### OTP Endpoints
- `POST /api/otp/send` - Send OTP to phone number
- `POST /api/otp/verify` - Verify OTP code
- `GET /health` - Health check

## 🛡️ Security Features

- Rate limiting (5 OTP requests per 15 minutes)
- OTP expiry (5 minutes)
- Max verification attempts (3 per OTP)
- Input validation and sanitization
- CORS protection

## 📊 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query

**Backend:**
- Node.js + Express
- Twilio (SMS service)
- CORS + Helmet (security)
- Rate limiting

## 🚨 Troubleshooting

**"Failed to send OTP"**
- Check Twilio credentials in `server/.env`
- Verify phone number format
- Check Twilio account balance

**"Network error"**
- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API URL

## 📖 Detailed Setup

For detailed setup instructions, see [OTP_SETUP.md](./OTP_SETUP.md)

## 🎯 Production Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins in `server.js`
3. Use environment-specific Twilio credentials
4. Set up proper logging and monitoring

---

**🎉 Ready to use! Your university mess portal with real SMS OTP is now running.**