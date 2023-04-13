import * as pg from 'pg';
import { SequelizeOptions } from 'sequelize-typescript';
import { getProcessEnv } from 'utils/utils-env-config';
import models from './models';

const options: SequelizeOptions = {
  host: getProcessEnv().DB_URL,
  port: getProcessEnv().DB_PORT,
  database: getProcessEnv().DB_NAME,
  username: getProcessEnv().DB_USERNAME,
  password: getProcessEnv().DB_PASSWORD,
  dialect: 'postgres',
  dialectModule: pg,
  models: models,
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
export default options;
