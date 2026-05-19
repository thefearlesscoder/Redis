import { Queue } from "bullmq";

const connection = {
  host: "localhost",
  port: 6379,
}; // redis connection options

// noe many types of queues, we can have one for emails, one for notifications, etc.
const emailQueue = new Queue("emailQueue", { connection });

module.exports = {
  emailQueue,
  connection,
};