import { setCookie } from 'hono/cookie';
import { verifyRefreshToken, generateTokens } from '../utils/jwt.mjs';
import { prisma } from '../db.mjs';

export async function refreshToken(ctx) {
  const refreshToken = ctx.req.cookies.refreshToken;

  if (!refreshToken) return ctx.json({ error: 'No refresh token' }, 400);

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return ctx.json({ error: 'Invalid refresh token' }, 403);

  // Fetch user from DB
  const user = await prisma.user.findUnique({
    where: { email: decoded.email }
  });

  if (!user) return ctx.json({ error: 'User not found' }, 404);

  // Generate new tokens
  const tokens = generateTokens({ email: user.email });

  setCookie(ctx, 'refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      path: '/auth/refresh',
    });

  // Return access token and user info
  return ctx.json({
    accessToken: tokens.accessToken,
    user: {
      email: user.email,
    },
  });
}
