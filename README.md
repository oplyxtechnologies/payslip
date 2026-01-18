# Payslip Generator

A local-only payslip generator application built with Next.js and Express.js that creates professional, pixel-perfect PDF payslips.

## Features

- 📄 Generate professional payslips matching standard format
- 🏢 Organization settings with logo upload
- ✍️ Configurable signature modes (auto-generated or manual signatures)
- 💰 Dynamic earnings and deductions with auto-calculations
- 🔢 Automatic number-to-words conversion for net pay
- 📱 Responsive design (desktop and mobile)
- 💾 Local storage for organization settings
- 🖨️ High-quality PDF export using Puppeteer

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, TypeScript
- **Backend**: Express.js, Puppeteer, TypeScript
- **Runtime**: Bun (preferred) or npm

## Project Structure

```
payslip/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── layout.tsx       # Root layout with navigation
│   │   ├── page.tsx         # Main payslip generator
│   │   ├── settings/
│   │   │   └── page.tsx     # Organization settings
│   │   └── globals.css
│   ├── components/
│   │   ├── PayslipForm.tsx  # Form for payslip data entry
│   │   └── PayslipPreview.tsx # Live preview component
│   ├── lib/
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── utils.ts         # Utility functions
│   │   └── storage.ts       # localStorage helpers
│   └── package.json
│
├── backend/                  # Express server
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── routes/
│   │   │   └── payslip.ts   # PDF generation endpoint
│   │   └── types.ts         # Shared types
│   └── package.json
│
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- **Bun** (recommended): [Install Bun](https://bun.sh/)
- **OR Node.js** (v18+) and npm

### Installation

#### Using Bun (Recommended)

1. **Install frontend dependencies:**
   ```bash
   cd frontend
   bun install
   ```

2. **Install backend dependencies:**
   ```bash
   cd ../backend
   bun install
   ```

#### Using npm

1. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

You need to run both the frontend and backend servers.

#### Using Bun

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
bun run dev
```

#### Using npm

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Usage Guide

### 1. Configure Organization Settings

1. Navigate to **Settings** page (http://localhost:3000/settings)
2. Upload your company logo (PNG/JPG, max 2MB)
3. Enter organization details:
   - Company Name
   - Address Line 1
   - Address Line 2 (optional)
   - City, State - ZIP
4. Choose signature mode:
   - **Auto-generated**: Shows footer note, no signatures required
   - **Signature required**: Shows signature lines for employee and authorized signatory
5. Click **Save Settings**

### 2. Generate Payslip

1. Navigate to **Generate Payslip** page (http://localhost:3000)
2. Fill in payslip details:
   - Month and Year
   - Employee information (name, designation, location, etc.)
   - Total days, PH/WEO, LWP/Absent
3. Add/edit earnings:
   - Default rows: Basic, DA, HRA
   - Click "+ Add Row" to add custom earnings
   - Click "×" to remove rows
4. Add/edit deductions:
   - Default rows: Provident Fund, PT
   - Click "+ Add Row" to add custom deductions
   - Click "×" to remove rows
5. Review the **Live Preview** on the right (or below on mobile)
6. Click **Export PDF** to download the payslip

### 3. PDF Export

- PDFs are downloaded automatically to your browser's download folder
- Filename format: `payslip_[EmployeeName]_[Month]_[Year].pdf`
- PDF is A4 size with proper margins
- Layout matches the sample payslip format exactly

## Architecture Decisions

### Logo Storage: Base64 in localStorage

**Why?**
- ✅ Simpler architecture (no file system dependencies)
- ✅ Works seamlessly across environments
- ✅ Easy to include in PDF generation payload
- ✅ No file cleanup/management needed
- ⚠️ localStorage limit: ~5-10MB (sufficient for logos)

### PDF Generation: Puppeteer

**Why?**
- ✅ Pixel-perfect HTML-to-PDF conversion
- ✅ Easy to match exact layout with CSS
- ✅ Supports embedded images (base64)
- ✅ Professional-quality output

### Signature Mode: Organization-level Setting

The signature toggle is in the Settings page (not per-payslip) to keep organization-level preferences centralized. All payslips use the same signature mode until changed in settings.

## Development Notes

### CORS Configuration

The backend is configured to accept requests from `http://localhost:3000`. If you change the frontend port, update the CORS settings in `backend/src/index.ts`.

### Environment Variables

Create a `.env` file in the root directory (optional):
```
FRONTEND_URL=http://localhost:3000
BACKEND_PORT=3001
```

### Building for Production

**Frontend:**
```bash
cd frontend
bun run build  # or npm run build
bun run start  # or npm run start
```

**Backend:**
```bash
cd backend
bun run build  # or npm run build
bun run start  # or npm run start
```

## Troubleshooting

### PDF Export Fails

**Issue**: "Failed to export PDF" error

**Solutions**:
1. Ensure backend server is running on port 3001
2. Check browser console for CORS errors
3. Verify organization settings are configured
4. Check backend terminal for Puppeteer errors

### Logo Not Showing

**Issue**: Logo doesn't appear in preview or PDF

**Solutions**:
1. Ensure image is PNG or JPG format
2. Check file size is under 2MB
3. Try re-uploading the logo
4. Clear browser cache and localStorage

### Settings Not Persisting

**Issue**: Settings reset after page refresh

**Solutions**:
1. Check browser localStorage is enabled
2. Ensure you clicked "Save Settings"
3. Check browser console for errors
4. Try a different browser

## License

This project is for internal use only.

## Support

For issues or questions, please contact your development team.
