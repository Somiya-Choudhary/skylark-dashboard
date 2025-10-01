import { prisma } from '../db.mjs';


export async function getUserData(c){
    const user = c.get("user"); // from authMiddleware

    if (!user?.email) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (!dbUser) {
        return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
        user: dbUser,
    });
}