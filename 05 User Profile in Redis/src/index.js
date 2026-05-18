import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/user/:id/json', async(req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body)); // key -> `user:${req.params.id}:json`
    res.json({message: 'User profile saved'});
})


app.get('/user/:id/json', async(req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);
    if(!raw){
        return res.status(404).json({message: 'User not found'});
    }
    console.log(raw);
    res.json(JSON.parse(raw));
})

app.post('/user/:id/hash', async(req, res) => { // data not kept in string form we want in object form
    await redis.hset(`user:${req.params.id}:hash`, req.body); // key -> `user:${req.params.id}:hash`
    res.json({message: 'User profile saved as hash'});
})

app.get('/user/:id/hash', async(req, res) => {
    const data = await redis.hgetall(`user:${req.params.id}:hash`);
    if(Object.keys(data).length === 0){
        return res.status(404).json({message: 'User not found'});
    }
    res.json(data);
})

app.listen(3000, () => {
    console.log("Sever running on port 3000");
})