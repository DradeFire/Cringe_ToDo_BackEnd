import { NextFunction, Response } from 'express';
import BaseRequest from 'modules/base/base.request';

//--------------------------------------
//api-decorators
//--------------------------------------

export enum ApiMethodTypes {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

//Интерфейс - для передачи метода в @ApiController
export interface IRouteMethod {
  propertyKey: string; //Название метода
  type: ApiMethodTypes;
  path: string;
  handlers: ((req: BaseRequest, res: Response, next: NextFunction) => Promise<void> | void)[];
  routeParams?: IRouteParams;
}

//Дополнительные параметры метода - которые передаются в @GET('PATH', {...})
export interface IRouteParams {
  handlers?: ((req: BaseRequest, res: Response, next: NextFunction) => Promise<void> | void)[];

  headers?: { [name: string]: string | boolean | number }; //Заголовки запроса
  query?: { [name: string]: string | boolean | number }; //query запроса
  body?: any; //Тело запроса
  fileList?: string[]; //multipart-form/data тело запроса
  summary?: string; //Краткое описание
  description?: string; //Полное описание
  responses?: IApiResponse[]; //Список возможных ответов от сервера
}

//Ответ от сервера
export interface IApiResponse {
  code: number; //Код ответа
  description?: string; //Описание ответа
  body?: any; //Тело ответа
  modelName?: string; //Название модели, в ответе
}

//------------------------------------
//swagger-generator
//------------------------------------

export enum SWParamInEnum {
  HEADER = 'header',
  QUERY = 'query',
  PATH = 'path',
}

export interface SWTag {
  name: string; //Название тага
  description?: string; //описание метода
}

export interface SWMethod {
  tags?: string[]; //Массив тагов
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: SWMethodParam[];
  requestBody?: { content: { [resFormat: string]: { schema: SWComponentProp } } };
  responses: { [code: string]: SWMethodResponse };
}

export interface SWMethodParam {
  in: SWParamInEnum; //Где параметр идет
  name: string; //Название параметра
  description?: string;
  required: boolean;
  schema: SWMethodParamSchema;
}

export interface SWMethodParamSchema {
  type: string;
  format?: string;
  example?: any;
}

export interface SWMethodResponse {
  description?: string;
  content?: { [resFormat: string]: { schema: SWComponentProp } };
}

//Схема модели для запроса/ответа
export interface SWRequiredProps {
  required?: string[];
  properties: { [propName: string]: SWComponentProp };
}

//Схема одного ПРОПА для МОДЕЛИ! (RESPONSE, req.body)
export interface SWComponentProp {
  type: string;
  format?: string;
  example?: any;
  required?: string[];
  properties?: { [propName: string]: SWComponentProp };
  items?: SWComponentProp;
}

//------------------------------------
//swagger-utils
//------------------------------------

//Схема для дополнительных HEADERS и QUERY в дефолтных методах
export interface IAdditionalHQ {
  headers?: { [name: string]: string | boolean | number };
  query?: { [name: string]: string | boolean | number };
}
