import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json()); // this middleware required since we want to send data using express.

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379'); // creating redis client

const BANNER_KEY = "app:banner";

app.post('/banner', async(req , res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to the Website");
    res.json({success: true});
});

app.get('/banner', async(req , res) => {
    const message = await redis.get(BANNER_KEY);

    res.json({message});
})

// delete the key value pair
app.delete('/banner', async(req , res) => {
    await redis.del(BANNER_KEY); 
    res.json({sucess: true});
})

app.get('/banner/exists', async(req , res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({exists});
})

app.listen(3000, () =>{
    console.log("Server running at port 3000");
})