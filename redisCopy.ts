import Redis from 'ioredis';

async function syncRedisKeys(sourceRedis: Redis, targetRedis: Redis) {
    console.log('start sync redis keys');
    const keys = await sourceRedis.keys('*');
    for (const key of keys) {
        const type = await sourceRedis.type(key);
        console.log(`key: ${key}, type: ${type}`)
        switch (type) {
            case 'string':
                const value = await sourceRedis.get(key);
                await targetRedis.set(key, value);
                break;
            case 'list':
                const list = await sourceRedis.lrange(key, 0, -1);
                await targetRedis.rpush(key, ...list);
                break;
            case 'set':
                const set = await sourceRedis.smembers(key);
                await targetRedis.sadd(key, ...set);
                break;
            case 'zset':
                const zset = await sourceRedis.zrange(key, 0, -1, 'WITHSCORES');
                await targetRedis.zadd(key, ...zset);
                break;
            case 'hash':
                const hash = await sourceRedis.hgetall(key);
                await targetRedis.hmset(key, hash);
                break;
        }
    }

    console.log('sync redis keys done');
}

const sourceRedis = new Redis({host: '192.168.0.211'});
const targetRedis = new Redis({host: '192.168.0.212'});

syncRedisKeys(sourceRedis, targetRedis).catch(console.error).finally(() => {
    sourceRedis.quit();
    targetRedis.quit();
});
