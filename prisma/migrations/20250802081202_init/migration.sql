-- CreateTable
CREATE TABLE "public"."waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "referred_by" TEXT,
    "position" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT DEFAULT '{}',
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "last_email_sent" TIMESTAMP(3),
    "email_failures" INTEGER NOT NULL DEFAULT 0,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_log" (
    "id" TEXT NOT NULL,
    "recipient_email" TEXT NOT NULL,
    "email_type" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "error_message" TEXT,
    "waitlist_id" TEXT,

    CONSTRAINT "email_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."milestone_tracking" (
    "id" TEXT NOT NULL,
    "milestone" INTEGER NOT NULL,
    "reached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emails_sent" INTEGER NOT NULL DEFAULT 0,
    "emails_failed" INTEGER NOT NULL DEFAULT 0,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "milestone_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin_notification_log" (
    "id" TEXT NOT NULL,
    "notification_type" TEXT NOT NULL,
    "trigger_count" INTEGER NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipients" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error_message" TEXT,

    CONSTRAINT "admin_notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "public"."waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_referral_code_key" ON "public"."waitlist"("referral_code");

-- CreateIndex
CREATE INDEX "waitlist_email_idx" ON "public"."waitlist"("email");

-- CreateIndex
CREATE INDEX "waitlist_referral_code_idx" ON "public"."waitlist"("referral_code");

-- CreateIndex
CREATE INDEX "waitlist_referred_by_idx" ON "public"."waitlist"("referred_by");

-- CreateIndex
CREATE INDEX "waitlist_position_idx" ON "public"."waitlist"("position");

-- CreateIndex
CREATE INDEX "waitlist_joined_at_idx" ON "public"."waitlist"("joined_at");

-- CreateIndex
CREATE INDEX "waitlist_email_sent_idx" ON "public"."waitlist"("email_sent");

-- CreateIndex
CREATE INDEX "waitlist_unsubscribed_idx" ON "public"."waitlist"("unsubscribed");

-- CreateIndex
CREATE INDEX "email_log_recipient_email_idx" ON "public"."email_log"("recipient_email");

-- CreateIndex
CREATE INDEX "email_log_email_type_idx" ON "public"."email_log"("email_type");

-- CreateIndex
CREATE INDEX "email_log_sent_at_idx" ON "public"."email_log"("sent_at");

-- CreateIndex
CREATE INDEX "email_log_success_idx" ON "public"."email_log"("success");

-- CreateIndex
CREATE INDEX "email_log_waitlist_id_idx" ON "public"."email_log"("waitlist_id");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_tracking_milestone_key" ON "public"."milestone_tracking"("milestone");

-- CreateIndex
CREATE INDEX "milestone_tracking_milestone_idx" ON "public"."milestone_tracking"("milestone");

-- CreateIndex
CREATE INDEX "milestone_tracking_reached_at_idx" ON "public"."milestone_tracking"("reached_at");

-- CreateIndex
CREATE INDEX "admin_notification_log_notification_type_idx" ON "public"."admin_notification_log"("notification_type");

-- CreateIndex
CREATE INDEX "admin_notification_log_sent_at_idx" ON "public"."admin_notification_log"("sent_at");

-- CreateIndex
CREATE INDEX "admin_notification_log_trigger_count_idx" ON "public"."admin_notification_log"("trigger_count");

-- AddForeignKey
ALTER TABLE "public"."waitlist" ADD CONSTRAINT "waitlist_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "public"."waitlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_log" ADD CONSTRAINT "email_log_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "public"."waitlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
