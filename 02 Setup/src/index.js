import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379'); // client of redis
// this connects to the redis server running on localhost at port 6379 / docker container

// Connect to MongoDB once at startup
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/exampledb').then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// let's ping redis
app.get("/redis", async(req, res) => {
    try {
        const result = await redis.ping();
        res.send(result); // should return 'PONG'
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        res.status(500).send("Error connecting to Redis");
    }
});

app.get('/mongo', async (req, res) => {
    try {
        res.send("Connected to MongoDB");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});