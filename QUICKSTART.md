# Quick Start Guide - Payslip Generator

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

Open **two terminal windows** in the project folder.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Backend will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend will start on http://localhost:3000 (or next available port)

### Step 3: Use the Application

1. **Configure Settings** (first time only)
   - Go to: http://localhost:3000/settings
   - Upload company logo
   - Enter organization details
   - Choose signature mode
   - Click "Save Settings"

2. **Generate Payslip**
   - Go to: http://localhost:3000
   - Fill in employee details
   - Add/edit earnings and deductions
   - Review live preview
   - Click "Export PDF"

## 📁 Project Structure

```
payslip/
├── frontend/     # Next.js app (port 3000)
├── backend/      # Express server (port 3001)
├── README.md     # Full documentation
└── .env.example  # Environment variables
```

## 🔧 Troubleshooting

**PDF Export Not Working?**
- Ensure backend is running on port 3001
- Check browser console for errors

**Settings Not Saving?**
- Enable localStorage in browser
- Click "Save Settings" button

**Port Already in Use?**
- Frontend will auto-increment to next available port
- Update CORS in backend if needed

## 📚 Full Documentation

See [README.md](file:///d:/Project/Webiste/payslip/README.md) for complete setup instructions and usage guide.

## ✨ Features

- ✅ Professional PDF payslips
- ✅ Logo upload
- ✅ Dynamic earnings/deductions
- ✅ Auto-calculations
- ✅ Number-to-words conversion
- ✅ Signature modes
- ✅ Live preview
- ✅ Responsive design
