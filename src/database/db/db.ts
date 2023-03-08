import { Sequelize } from "sequelize-typescript";
import { Dev_Config, PROD_Config } from "../config/db_config";
import CurrentEnv, { Env } from "../../utils/env_config";

/**
 * Получает объект Sequelize с текущим конфигом окружения
 * @returns Sequelize с текущим конфигом
 */
function getSequelize(): Sequelize {
    switch (CurrentEnv.env()) {
        case Env.DEV: {
            return new Sequelize(Dev_Config);
        }
        case Env.PROD: {
            return new Sequelize(PROD_Config);
        }
    }
}

const sequelizeInstance = getSequelize();

/**
 * Инициализация БД
 */
const initDB = async () => {
    await sequelizeInstance.authenticate(); //Авторизация нашей ORM в БД

    // await sequelizeInstance.dropSchema('public', {});
    // await sequelizeInstance.createSchema('public', {});

    await sequelizeInstance.sync(); //Синхронизация МОДЕЛЕЙ
};

export {
    sequelizeInstance,
    initDB,
};