# 🍽️ Campus Eats - University Mess Portal

A modern, real-time university mess/canteen management system with demo OTP authentication.

## ✨ Features

- **Demo OTP Authentication** - Simple mock OTP system for demonstration
- **Student Dashboard** - Live crowd monitoring, table booking, meal schedules
- **Admin Dashboard** - Real-time analytics, threshold management, activity monitoring
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Toggle between themes
- **Real-time Updates** - Live data updates every few seconds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 

### 1. Install Dependencies
```bash
git clone <your-repo>
cd campus-eats-track
npm install
```

### 2. Start Development
```bash
npm run dev
```

### 3. Access the App
- **Frontend**: http://localhost:5173

## 📱 Testing Demo OTP

- **Any phone number**: Will show OTP in toast notification
- **Admin access**: Use `+911234567890` to login as admin
- **Student access**: Use any other number

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
campus-eats-track/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎯 Demo Features

### OTP Flow
1. **User enters phone number** → Validates format
2. **Clicks "Send OTP"** → Shows 6-digit code in toast
3. **User enters OTP** → Verifies against generated code
4. **Success** → Logs in as student or admin

### Dashboards
- **Student**: Live crowd count, table booking, meal schedules
- **Admin**: Analytics, threshold management, activity monitoring

## 📊 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query

## 🎨 UI Components

Built with shadcn/ui components:
- Cards, Buttons, Inputs
- Toast notifications
- Theme toggle
- Responsive design

## 🚀 Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Configure your domain and SSL

## 🎯 Demo Usage

1. **Start the app**: `npm run dev`
2. **Enter any phone number** (e.g., `+1234567890`)
3. **Click "Send OTP"** - Code appears in toast
4. **Enter the OTP code** from the toast
5. **Login as student** or use `+911234567890` for admin

---

**🎉 Ready to demo! Your university mess portal is now running with demo OTP authentication.**