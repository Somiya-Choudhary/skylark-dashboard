import { getCookie, setCookie } from 'hono/cookie';
import { verifyRefreshToken, generateTokens } from '../utils/jwt.mjs';

export async function refreshToken(ctx) {
  // Use getCookie helper from hono/cookie
  const token = getCookie(ctx, 'refreshToken');
  
  if (!token) {
    return ctx.json({ error: 'No refresh token provided' }, 401);
  }

  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(token);
    
    // Generate new tokens
    const tokens = generateTokens({ email: decoded.email });
    
    // Set new refresh token cookie
    setCookie(ctx, 'refreshToken', tokens.refreshToken, {
      httpOnly: true,
      // sameSite: 'Strict',
      sameSite: 'None',
      secure: true,  
      path: '/',
    });
    
    // Return new access token
    return ctx.json({
      accessToken: tokens.accessToken
    });
    
  } catch (error) {
    return ctx.json({ error: 'Invalid refresh token' }, 401);
  }
}