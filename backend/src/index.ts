import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectRoute from './routes/connect';
import toolsRoute from './routes/tools';
import callRoute from './routes/call';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' })); // Vite default port
app.use(express.json());

// Routes
app.use('/connect', connectRoute);
app.use('/tools', toolsRoute);
app.use('/call', callRoute);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;