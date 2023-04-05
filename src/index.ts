import App from "./app";
import CurrentEnv, { Env } from "./utils/env_config";

async function startApp(env: Env) {
    let app: App

    switch (env) {
        case Env.DEV: {
            app = await App.create(Env.DEV);
            break;
        }
        case Env.PROD: {
            app = await App.create(Env.PROD);
            break;
        }
        case Env.TEST: {
            app = await App.create(Env.TEST);
            break;
        }
    }

    await app.listen()
}

startApp(CurrentEnv.env())