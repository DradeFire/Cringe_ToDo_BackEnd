import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
    ENV: string | undefined
    POSTGRES_USER: string | undefined
    POSTGRES_PASS: string | undefined
    POSTGRES_PORT: string | undefined
    POSTGRES_PROD_HOST: string | undefined
    POSTGRES_PROD_DB: string | undefined
}

interface Config {
    ENV: string
    POSTGRES_USER: string
    POSTGRES_PASS: string
    POSTGRES_PORT: string
    POSTGRES_PROD_HOST: string
    POSTGRES_PROD_DB: string
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
    return {
        ENV: process.env.ENV,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASS: process.env.POSTGRES_PASS,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        POSTGRES_PROD_HOST: process.env.POSTGRES_PROD_HOST,
        POSTGRES_PROD_DB: process.env.POSTGRES_PROD_DB
    };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;