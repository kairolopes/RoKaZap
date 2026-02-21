import Bull, { Job } from "bull";
import { logger } from "../shared/logger";
import { sendTextMessage } from "./zapiService";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export interface OutgoingMessageJob {
  phone: string;
  message: string;
}

export const outgoingMessageQueue = new Bull<OutgoingMessageJob>(
  "outgoing-messages",
  redisUrl
);

outgoingMessageQueue.process(async (job: Job<OutgoingMessageJob>) => {
  await sendTextMessage(job.data);
});

outgoingMessageQueue.on("failed", (job, err) => {
  logger.error("Outgoing message failed", {
    jobId: job.id,
    err,
  });
});

