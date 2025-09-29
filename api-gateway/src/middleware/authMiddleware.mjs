import { verifyToken } from '../utils/jwt.mjs';

export function authMiddleware() {
  return async (c, next) => {
    const authHeader = c.req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // Attach user info to context
    c.req.user = payload;

    await next();
  };
}
