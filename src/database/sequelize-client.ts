import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { getProcessEnv } from 'utils/utils-env-config';
import { logError, logInfo } from 'utils/utils-log';
import config from './sequelize-config';

export const sequelizeInstance = new Sequelize(config);

export async function createDbIfNotExist() {
  const dbName = getProcessEnv().DB_NAME;
  const client = new Client({
    user: getProcessEnv().DB_USERNAME,
    password: getProcessEnv().DB_PASSWORD,
    database: 'postgres',
    host: getProcessEnv().DB_URL,
    port: getProcessEnv().DB_PORT,
  });

  await client.connect();

  const allDB = await client.query('SELECT datname FROM pg_database');

  if (allDB.rows.findIndex((el) => el.datname === dbName.toLowerCase()) === -1) {
    logInfo('creating database');
    await client.query(`CREATE DATABASE ${dbName}`);
  }
  await client.end();
}

export async function initSequelize() {
  try {
    await sequelizeInstance.authenticate();
    // await sequelizeInstance.dropSchema('public', { });
    // await sequelizeInstance.createSchema('public', {  });
    await sequelizeInstance.sync();
    logInfo('Sequelize was initialized');
  } catch (error) {
    logError('Sequelize ERROR', error);
    process.exit();
  }
}
