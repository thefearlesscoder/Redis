import Redis from
    "ioredis";

const susbcriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

susbcriber.subscribe("notifications", (err, count) => {
    if (err) {
        console.error("Failed to subscribe: ", err);
    } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
    }
});

susbcriber.on("message", (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);
    // here we would process the email, but for this example we will just log it
});

