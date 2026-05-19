import express from "express";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const emailQueue = new Queue("emailQueue", { connection: redisConnection });