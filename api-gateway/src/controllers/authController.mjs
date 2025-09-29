import { prisma } from '../db.mjs';
// import { hashPassword, comparePassword } from '../utils/hash.mjs';

export async function register(ctx) {
  const { username, email, password } = await ctx.req.json();
  // const hashed = hashPassword(password);

  console.log("in register")

//   const user = await prisma.user.create({
//     data: { username, email, password: hashed },
//   });

  return ctx.json({ message: 'User registered', userId: 111 });
}


export async function login(ctx) {
  const { username, password } = await ctx.req.json();
  console.log("in login")

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return ctx.json({ error: 'User not found' }, 404);

  // const valid = comparePassword(password, user.password);
  // if (!valid) return ctx.json({ error: 'Invalid password' }, 401);

  return ctx.json({ message: 'Login successful', user: user });
}
