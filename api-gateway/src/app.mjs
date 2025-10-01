import { Hono } from 'hono';
import authRouter from './routes/authRoutes.mjs';
import apiRouter from './routes/apiRoutes.mjs';


const app = new Hono();

// Public routes
app.route('/auth', authRouter);


// Protected routes
app.route('/api', apiRouter);


export default app;
