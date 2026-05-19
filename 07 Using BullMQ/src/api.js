import express from "express";
import {emailQueue} from "./queue.js";

const app = express();
app.use(express.json());

app.post("/welcome/email", async (req, res) => {
    const job = await emailQueue.add(
        "send-welcome-email",
        {
            to: req.body.to,
            subject: req.body.subject,
            body: req.body.body,
        },
        {
            //consfiguratsion options for the job, like retries, delay, etc.
            attempts: 3, // number of retries if the job fails
            backoff: {
                type: "exponential",
                delay: 1000, // initial delay for retries
            },
        }
    )
    res.json({ message: "Welcome email job added to queue", jobId: job.id });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});