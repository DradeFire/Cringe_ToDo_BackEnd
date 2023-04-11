import { AxiosRequestConfig } from 'axios';

export interface INetResult<RESPONSE_TYPE = any> {
  isSuccess: boolean;
  code: number;
  message?: string;
  data?: RESPONSE_TYPE;
  errorData?: any;
}

export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type INetRequest<REQUEST_TYPE = any> = AxiosRequestConfig<REQUEST_TYPE>;
