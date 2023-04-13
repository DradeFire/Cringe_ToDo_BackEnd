import express, { Application, Request, Response } from "express";
import cors from "cors";
import { getProcessEnv } from 'utils/utils-env-config';
import { logInfo } from 'utils/utils-log';
import http from 'http';
import ip from 'ip';
import helmet from 'helmet'
import { notFound } from "middlewares/not-found";
import { errorHandler } from "middlewares/error-handler";
import { requestLogger } from "middlewares/logger";
import { Constants } from "utils/constants";
import { cwd } from "process";
import SwaggerDoc from "core/swagger-doc";
import { createDbIfNotExist, initSequelize } from "database/sequelize-client";
import controllers from "modules/controllers";

export default class App {
  private app: express.Application;
  private port: number;
  private server: http.Server;
  private IP: string;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.IP = ip.address();
    this.port = getProcessEnv().SERVER_PORT;
  }

  /**
   * Инициализация приложения
   */
  static async create(): Promise<App> {
    const app = new App();

    // await createDbIfNotExist();
    await initSequelize();
    app.initMiddlewares()
    app.initControllers();
    app.initErrorHandling();

    return app;
  }

  /**
   * Инициализация различных утилит express
   */
  private initMiddlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
  }

  /**
   * Обработчики ошибок
   */
  private initErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  /**
   * Инициализация путей (Routes)
   * @example this.app.use("/api/task", asyncHandler(requireToken), taskRoutes);
   */
  private initControllers() {

    const ctrlArr: any[] = controllers;

    this.app.use(Constants.SWAGGER_DOCS, express.static(`${cwd()}/${Constants.SWAGGER_UI_DIST_PATH}`));
    this.app.use(Constants.SWAGGER_JSON, (_1, res, _2) => res.json(SwaggerDoc.get()));

    this.app.use(requestLogger);

    this.app.all('/test', (req: Request, res: Response) => {
      res.status(200).json({
        message: `Service is working on port: ${this.port}`,
      });
    });



    ctrlArr.forEach((el) => {
      console.log(el.path)
      console.log(el.router)
      this.app.use(el.path, el.router)
    });
  }

  public async listen() {
    this.server.listen(this.port, () => {
      logInfo(`Service ready on address: http://${this.IP}:${this.port}`);
    });
  }

}