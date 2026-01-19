import express, { Request, Response } from 'express';
import cors from 'cors';
import payslipRouter from './routes/payslip';

const app = express();
// Robust port parsing: Ensure PORT is a valid number, otherwise fallback to 5000
// This prevents crashes if the user accidentally sets PORT to a URL in the dashboard
const envPort = parseInt(process.env.PORT as string, 10);
const PORT = (!isNaN(envPort) && envPort > 0) ? envPort : 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS configuration - environment-based
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  FRONTEND_URL,
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Routes
app.use('/api/payslip', payslipRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📄 Environment: ${NODE_ENV}`);
  console.log(`🔗 PDF endpoint: /api/payslip/pdf`);
  console.log(`🏥 Health check: /health`);
});
