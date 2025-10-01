import jwt from 'jsonwebtoken';

// Keep this secret safe (or load from .env)
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Generate token
export function generateTokens(payload) {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '2m' });

  return { accessToken, refreshToken };

}

// Verify access token
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}
