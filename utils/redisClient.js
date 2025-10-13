const { createClient } = require('redis');
require("dotenv").config();

const redisClient = createClient({
  username:'default', // Redis server URL
  password:process.env.REDIS_PASSCODE,
  socket:{
    host:process.env.REDIS_HOST,
    port:19920
  }
});

redisClient.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis
redisClient.connect().then(() => {
    console.log('Connected to Redis successfully!');
}).catch(err => {
    console.error('Failed to connect to Redis:', err);
});

module.exports = redisClient;