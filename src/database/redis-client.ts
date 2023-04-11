import * as Redis from 'redis';
import { getProcessEnv } from 'utils/utils-env-config';
import { logError, logInfo } from 'utils/utils-log';

export const redis = Redis.createClient({
  url:
    'redis://' +
    getProcessEnv().REDIS_DB_URL +
    ':' +
    getProcessEnv().REDIS_PORT +
    '/' +
    getProcessEnv().REDIS_DB_NUMBER,
  password: getProcessEnv().REDIS_PASSWORD,
});

export async function initRedis() {
  redis.on('error', (err) => {
    logError('Redis ERROR', err);
    process.exit();
  });

  await redis.connect();

  // await redis.flushDb();

  logInfo('Redis was initialized');
}
