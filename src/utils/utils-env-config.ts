class ProcessENV {
  //Порт для запуска самого сервера
  public SERVER_PORT: number = 3000; //При запуске через ДОКЕР - НЕ МЕНЯТЬ !
  public SERVER_URL: string = '';

  //Всё что касается основной БД
  public DB_URL: string = 'localhost';
  public DB_PORT: number = 5432;
  public DB_NAME: string = 'dev_example_db';
  public DB_USERNAME: string = '';
  public DB_PASSWORD: string = '';

  //Все что касается редиски
  public REDIS_DB_URL: string = 'IP';
  public REDIS_PORT: number = 6379;
  public REDIS_DB_NUMBER: number = 0; //ВСЕГДА 0
  public REDIS_PASSWORD: string = '';
}

let processENV: ProcessENV | null = null;

export function getProcessEnv(): ProcessENV {
  if (processENV === null) {
    processENV = new ProcessENV();

    if (typeof process.env.SERVER_PORT === 'string') {
      processENV.SERVER_PORT = Number(process.env.SERVER_PORT);
    }

    if (typeof process.env.SERVER_URL === 'string') {
      processENV.SERVER_URL = process.env.SERVER_URL;
    }

    // if (typeof process.env.SERVER_URL === 'string') {
    //   processENV.SERVER_URL = process.env.SERVER_URL;
    // }

    //DB - PostgreSQL
    if (typeof process.env.DB_URL === 'string') {
      processENV.DB_URL = process.env.DB_URL;
    }
    if (typeof process.env.DB_PORT === 'string') {
      processENV.DB_PORT = Number(process.env.DB_PORT);
    }
    if (typeof process.env.DB_NAME === 'string') {
      processENV.DB_NAME = process.env.DB_NAME;
    }
    if (typeof process.env.DB_USERNAME === 'string') {
      processENV.DB_USERNAME = process.env.DB_USERNAME;
    }
    if (typeof process.env.DB_PASSWORD === 'string') {
      processENV.DB_PASSWORD = process.env.DB_PASSWORD;
    }

    //DB - Redis
    if (typeof process.env.REDIS_DB_URL === 'string') {
      processENV.REDIS_DB_URL = process.env.REDIS_DB_URL;
    }
    if (typeof process.env.REDIS_PORT === 'string') {
      processENV.REDIS_PORT = Number(process.env.REDIS_PORT);
    }
    if (typeof process.env.REDIS_DB_NUMBER === 'string') {
      processENV.REDIS_DB_NUMBER = Number(process.env.REDIS_DB_NUMBER);
    }
    if (typeof process.env.REDIS_PASSWORD === 'string') {
      processENV.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    }
  }
  return processENV;
}
