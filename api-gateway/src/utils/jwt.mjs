import jwt from 'jsonwebtoken';

// Keep this secret safe (or load from .env)
const SECRET = process.env.JWT_SECRET;

// Generate token
export function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

// Verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
