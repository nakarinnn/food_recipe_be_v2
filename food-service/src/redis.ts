import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = createClient({
  url: redisUrl,
});

redis.connect();

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export default redis;
