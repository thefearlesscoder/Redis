// otp verification with TTL
import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone){
    return `otp:${phone}`;
}

app.post('/otp', async(req , res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 30); // otp expipres in 30 sec
    res.json({message: 'otp sent', otp});// in real app otp sent through sms

});

// now user's otp has to be verified.
// first check if key exists
// if key exists very the key value with the opt entered by the use.

app.post('/otp/verify', async(req, res) => {
    const {phone, otp} = req.body;
    const savedOtp = await redis.get(otpKey(phone));
    
    if(!savedOtp){
        res.status(400).json({message: "OTP expired or not found"});
    }
    if(savedOtp !== otp){
        res.status(400).json({message: 'Invalid OTP'});
    }    
    /* otp validated -> write logic here */
    await redis.del(otpKey(phone));
    res.json({message: "OTP verified succesfully"});
});

app.get('/otp/:phone/ttl', async(req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
})

app.listen(3000, () => {
    console.log("Sever running on port 3000");
})
