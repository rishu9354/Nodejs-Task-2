const { createClient } = require('redis');
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URI // Redis server URL
});

redisClient.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis
redisClient.connect().then(() => {
    console.log('Connected to Redis successfully!');
}).catch(err => {
    console.error('Failed to connect to Redis:', err);
});

module.exports = redisClient;