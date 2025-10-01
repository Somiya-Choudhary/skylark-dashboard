import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRouter from './routes/authRoutes.mjs';
import apiRouter from './routes/apiRoutes.mjs';


const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposeHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 600, // Cache preflight for 10 minutes
}));

// Public routes
app.route('/auth', authRouter);

// Protected routes
app.route('/api', apiRouter);


export default app;
