import { Hono } from 'hono';
import { register, login } from '../controllers/authController.mjs';
import { refreshToken} from '../controllers/refreshToken.mjs'

const authRouter = new Hono();

authRouter.get('/refresh', refreshToken)
authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
