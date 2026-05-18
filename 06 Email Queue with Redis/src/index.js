import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// redis used as queue (raw usage and its problems)
// list architecture present in redis, we can use it as a queue
// LPUSH to add to the queue, RPOP to consume from the queue
// but if we have multiple consumers, we can have a race condition.

const QUEUE_NAME = 'queue:email';

app.post('/emails', async(req , res) => {
    const{ to, subject, body} = req.body;
    if(!to || !subject || !body) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body,
        createdAt: new Date().toISOString()
    } // email (in standard practice we call it a job)
    await redis.lpush(QUEUE_NAME, JSON.stringify(job));
    res.status(201).json({ message: 'Email added to queue' });
})

app.get('/emails/process-one', async(req, res) => {
    const rawJob = await redis.rpop(QUEUE_NAME);
    if(!rawJob) {
        return res.status(200).json({ message: 'No jobs in queue' });
    }
    const job = JSON.parse(rawJob);
    // here we would process the email, but for this example we will just return it
    res.status(200).json({ message: 'Email processed', job });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})