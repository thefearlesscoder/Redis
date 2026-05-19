import { Worker } from "bullmq";
import { emailQueue, connection } from "./queue.js";

// worker is a process that will consume jobs from the queue and process them
// we can have multiple workers consuming from the same queue, and they will automatically distribute the jobs among themselves
const worker = new Worker("emailQueue", async (job) => {
    // here we would process the email, but for this example we will just log it
    console.log("Processing job:", job.data);
}, { connection });

// we can listen to events emitted by the worker
worker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with error:`, err);
});

console.log("Worker is running and waiting for jobs...");