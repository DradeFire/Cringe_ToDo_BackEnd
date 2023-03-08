import config from "./config";
import { UrlConst } from "./constants";

/**
 * Конфигурация
 * @enum DEV - конфиг разработки
 * @enum PROD - конфиг продакшена
 */
export enum Env {
    DEV,
    PROD
}


export default class CurrentEnv {

    /**
     * Получить текущую конфигурацию проекта
     * @returns Env.DEV или Env.PROD
     */
    static env(): Env {
        console.log(config.ENV)
        switch (process.env.ENV) {
            case "DEV": {
                return Env.DEV
            }
            case "PROD": {
                return Env.PROD
            }
            default: {
                throw new Error("Unknown env")
            }
        }
    }
}

export function getCurrentPort(): number {
    switch (CurrentEnv.env()) {
        case Env.DEV: {
            return UrlConst.DEV_PORT;
        }
        case Env.PROD: {
            return UrlConst.PROD_PORT;
        }
    }
}