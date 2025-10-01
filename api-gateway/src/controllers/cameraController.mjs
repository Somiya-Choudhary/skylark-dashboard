import { prisma } from '../db.mjs';


export async function addCamera(ctx) {
    console.log("in camera contr")
  const body = await ctx.req.json();
  const { camera, user } = body;

  if (!camera?.name || !camera?.rtspUrl || !camera?.location || !user?.email) {
    return ctx.json({ error: 'All fields are required' }, 400);
  }

  // Find user by email
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return ctx.json({ error: 'User not found' }, 404);
  }

  const createdCamera = await prisma.camera.create({
    data: {
      name: camera.name,
      rtspUrl: camera.rtspUrl,
      location: camera.location,
      userId: dbUser.id,  // use the actual user id from DB
      isEnabled: camera.isEnabled ?? true,
      isStreaming: camera.isStreaming ?? false,
      faceDetectionEnabled: camera.faceDetectionEnabled ?? true,
      fps: camera.fps ?? 30,
      webrtcStreamId: camera.webrtcStreamId ?? null,
    },
  });

  return ctx.json(createdCamera);
}

