import { AxiosResponse } from 'axios';
import { INetRequest, INetResult } from './net-client-types';
import { logError, logInfo, logWarn } from 'utils/utils-log';

//Дефолтные заголовки для отправки файлов на сервер
export const MEDIA_HEADERS = {
  'Content-Type': 'multipart/form-data',
};

export const OCTET_STREAM_HEADERS = {
  'Content-Type': 'application/octet-stream',
};

export function handleAxiosSuccess<RESPONSE_TYPE = any, REQUEST_TYPE = any>(
  response: AxiosResponse<RESPONSE_TYPE, REQUEST_TYPE>
): INetResult<RESPONSE_TYPE> {
  return {
    isSuccess: true,
    code: response.status,
    data: response.data,
  };
}

//обработчик ошибок
export function handleAxiosError(error: any): INetResult {
  const result: INetResult = {
    isSuccess: false,
    code: 500,
    message: 'Произошла неизвестная ошибка',
    errorData: null,
  };

  //Если там в ошибке нихрена нет -> сразу отдаем данные об этом
  if (error.response) {
    //Достаем код
    if (typeof error.response.status === 'number') {
      result.code = error.response.status;
    }
    //Достаем сообщение + данные
    if (error.response.data) {
      //Если в ошибке есть сообщение
      if (typeof error.response.data.message === 'string') {
        result.message = error.response.data.message;
      }

      //Если в ошибке есть errorData
      if (error.response.data.errorData) {
        result.errorData = error.response.data.errorData;
      }
    }
  }

  return result;
}

export function printAxiosRequestLog(iNetRequest: INetRequest) {
  logInfo('NetClient REQUEST', {
    method: iNetRequest.method,
    url: iNetRequest.url,
    headers: iNetRequest.headers,
    query: iNetRequest.params,
    body: iNetRequest.data ? JSON.stringify(iNetRequest.data, null, 2) : '',
  });
}

export function printAxiosResponseLog(response: AxiosResponse) {
  logInfo('NetClient RESPONSE', {
    method: response.config.method,
    url: response.config.url,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    body: response.data ? JSON.stringify(response.data, null, 2) : '',
  });
}

export function printAxiosErrorLog(error: any) {
  logWarn('NetClient ERROR');
  if (error.isAxiosError) {
    //Если там в ошибке нихрена нет -> сразу отдаем данные об этом
    if (error.response) {
      logWarn('NetClient ERROR (AXIOS RESPONSE)', {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
      });
    } else {
      logError('NetClient ERROR (AXIOS, NO RESPONSE)', error);
    }
  } else {
    logError('NetClient ERROR (NO AXIOS)', error);
  }
}
