import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const LEADERBOARD_KEY = "leaderboard";

app.post("/post/:id/view", async(req , res) =>{
    const postId = req.params.id;
    const views = await redis.incr(`post:${postId}:views`);
    await redis.zadd(LEADERBOARD_KEY, "CH", views, postId);
    res.json({ message: `Post ${postId} view count incremented`, views });
})

//"CH" only changes what Redis returns:
// with CH, return is number of members added or changed
// without CH, return is number of new members added only

app.post("/leaderboard/score", async(req, res) => {
    const { postId, score } = req.body;
    if (!postId || !score) {
        return res.status(400).json({ error: "Missing postId or score" });
    }
    await redis.zincrby(LEADERBOARD_KEY, score, postId);
    res.json({ message: `Post ${postId} score updated by ${score}` });
})

app.get("/leaderboard", async(req, res) => {
    const topPosts = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "WITHSCORES"); // get top 10 posts with scores
    const leaderboard = [];
    for (let i = 0; i < topPosts.length; i += 2) {
        leaderboard.push({ postId: topPosts[i], score: parseInt(topPosts[i + 1]) });
    }
    res.json({ topPosts, leaderboard });
})

app.get("/leaderboard/:id/rank", async(req, res) => {
    const postId = req.params.id;
    const rank = await redis.zrevrank(LEADERBOARD_KEY, postId);
    if (rank === null) {
        return res.status(404).json({ error: "Post not found in leaderboard" });
    }
    res.json({ postId, rank: rank + 1 }); // rank is 0-based so add 1.
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})