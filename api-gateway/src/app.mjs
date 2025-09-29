import { Hono } from 'hono';
import authRouter from './routes/authRoutes.mjs';
import { authMiddleware } from './middleware/authMiddleware.mjs';

const app = new Hono();

// app.use('*', authMiddleware());

// Mount routes
app.route('/auth', authRouter);
app.get('/auth1', (c) => {
  console.log('hello from hono');
  return c.text('Hello from /auth!');
});

export default app;




// import { Hono } from 'hono';
// import authRouter from './routes/authRoutes.mjs';

// const app = new Hono();

// // Mount auth routes at /auth
// app.route('/auth', authRouter);

// export default app;
