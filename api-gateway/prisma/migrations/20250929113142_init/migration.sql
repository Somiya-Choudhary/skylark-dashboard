-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cameras" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rtspUrl" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isStreaming" BOOLEAN NOT NULL DEFAULT false,
    "faceDetectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fps" INTEGER NOT NULL DEFAULT 30,
    "webrtcStreamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cameras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "detectionType" TEXT NOT NULL DEFAULT 'face',
    "confidence" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frameUrl" TEXT,
    "frameData" BYTEA,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."camera_stats" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "currentFps" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "droppedFrames" INTEGER NOT NULL DEFAULT 0,
    "totalDetections" INTEGER NOT NULL DEFAULT 0,
    "streamHealth" TEXT NOT NULL DEFAULT 'offline',
    "lastHeartbeat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "camera_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."video_content" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "videoUrl" TEXT,
    "videoData" BYTEA,
    "duration" INTEGER,
    "fileSize" INTEGER,
    "format" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "cameras_userId_idx" ON "public"."cameras"("userId");

-- CreateIndex
CREATE INDEX "alerts_cameraId_timestamp_idx" ON "public"."alerts"("cameraId", "timestamp");

-- CreateIndex
CREATE INDEX "alerts_timestamp_idx" ON "public"."alerts"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "camera_stats_cameraId_key" ON "public"."camera_stats"("cameraId");

-- CreateIndex
CREATE INDEX "video_content_cameraId_startTime_idx" ON "public"."video_content"("cameraId", "startTime");

-- AddForeignKey
ALTER TABLE "public"."cameras" ADD CONSTRAINT "cameras_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "public"."cameras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."camera_stats" ADD CONSTRAINT "camera_stats_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "public"."cameras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."video_content" ADD CONSTRAINT "video_content_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "public"."cameras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
