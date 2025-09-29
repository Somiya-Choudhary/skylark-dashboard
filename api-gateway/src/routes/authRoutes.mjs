import { Hono } from 'hono';
import { register, login } from '../controllers/authController.mjs';

const authRouter = new Hono();

authRouter.get('/register', register);
authRouter.post('/login', login);

export default authRouter;
