import { setCookie } from 'hono/cookie';

import { prisma } from '../db.mjs';
import { hashPassword, comparePassword } from '../utils/hash.mjs';
import { generateTokens } from '../utils/jwt.mjs';



export async function register(ctx) {
  const { username, email, password } = await ctx.req.json();

  if (!email || !password || !username) {
    return ctx.json({ error: 'All fields are required' }, 400);
  }

  const curUser = await prisma.user.findUnique({ where: { username } });
  if (curUser) return ctx.json({ error: 'User already exists' }, 400);

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });

  // Generate tokens
  const tokens = generateTokens({ email: user.email });

  setCookie(ctx, 'refreshToken', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'Strict',
    path: '/auth/refresh',
  });

  return ctx.json({
    accessToken: tokens.accessToken,
    user: {
      email: user.email,
    },
  });
}




export async function login(ctx) {
  const { email, password } = await ctx.req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return ctx.json({ error: 'User not found' }, 404);

  const valid = await comparePassword(password, user.password);
  if (!valid) return ctx.json({ error: 'Invalid password' }, 401);

  // Generate tokens
  const tokens = generateTokens({ email: user.email });

  setCookie(ctx, 'refreshToken', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'Strict',
    path: '/auth/refresh',
  });

  return ctx.json({
    accessToken: tokens.accessToken,
    user: {
      email: user.email,
    },
  });
}

