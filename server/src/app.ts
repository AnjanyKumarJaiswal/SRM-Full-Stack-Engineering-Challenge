import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleBFHL } from './routes/bfhl';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
  if (req.method === 'POST') {
    console.log(`[Payload Size] ${JSON.stringify(req.body).length} bytes`);
  }
  next();
});

app.post('/bfhl', handleBFHL);

app.get('/health', cors(), (_, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Server is healthy' 
  });
});

app.get('/', cors(), (_, res) => {
  res.status(200).json({ 
    message: 'SRM Full Stack Engineering Challenge API',
    health_check: '/health'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;