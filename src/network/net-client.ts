import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { logError } from 'utils/utils-log';
import { INetRequest, INetResult, RequestType } from './net-client-types';
import {
  handleAxiosError,
  handleAxiosSuccess,
  printAxiosErrorLog,
  printAxiosRequestLog,
  printAxiosResponseLog,
} from './net-client-utils';

export class NetClient {
  private targetHost: string = '';
  private axiosInstance: AxiosInstance = axios.create();
  private headersGetter?: (requestConfig: INetRequest) => Promise<AxiosRequestHeaders>;
  private configModifier?: (requestConfig: INetRequest) => Promise<AxiosRequestConfig>;
  private onRequestError?: (err: any) => Promise<boolean>;

  setHost(host: string) {
    this.targetHost = host;
    return this;
  }

  setOnRequestError(onRequesError: (error: any) => Promise<boolean>) {
    this.onRequestError = onRequesError;
    return this;
  }

  setHeadersGetter(headersGetter: (requestConfig: INetRequest) => Promise<AxiosRequestHeaders>) {
    this.headersGetter = headersGetter;
    return this;
  }

  setConfigModifier(configModifier: (requestConfig: INetRequest) => Promise<AxiosRequestConfig>) {
    this.configModifier = configModifier;
    return this;
  }

  async get<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequest<REQUEST_TYPE>) {
    requestConfig.method = RequestType.GET;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async post<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequest<REQUEST_TYPE>) {
    requestConfig.method = RequestType.POST;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async put<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequest<REQUEST_TYPE>) {
    requestConfig.method = RequestType.PUT;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async patch<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequest<REQUEST_TYPE>) {
    requestConfig.method = RequestType.PATCH;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async delete<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequest<REQUEST_TYPE>) {
    requestConfig.method = RequestType.DELETE;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async makeRequest<RESPONSE_TYPE = any, REQUEST_TYPE = any>(
    requestConfig: INetRequest<REQUEST_TYPE>
  ): Promise<INetResult<RESPONSE_TYPE>> {
    let targetUrl = `${this.targetHost}`;

    if (requestConfig.url) {
      targetUrl += requestConfig.url;
    }
    requestConfig.url = targetUrl;

    let headersFromGetter: AxiosRequestHeaders = {};
    if (this.headersGetter) {
      try {
        headersFromGetter = await this.headersGetter(requestConfig);
      } catch (error) {
        logError('HeadersGetter ERROR', error);
      }
    }
    requestConfig.headers = {
      ...headersFromGetter,
      ...requestConfig.headers,
    };

    printAxiosRequestLog(requestConfig);

    let configFinal = {
      ...requestConfig,
    };

    if (this.configModifier) {
      try {
        configFinal = await this.configModifier(configFinal);
      } catch (error) {
        logError('configModifier ERROR', error);
      }
    }

    try {
      const response = await this.axiosInstance.request<
        RESPONSE_TYPE,
        AxiosResponse<RESPONSE_TYPE, REQUEST_TYPE>,
        REQUEST_TYPE
      >(configFinal);

      printAxiosResponseLog(response);

      return handleAxiosSuccess<RESPONSE_TYPE, REQUEST_TYPE>(response);
    } catch (error: any) {
      printAxiosErrorLog(error);
      if (this.onRequestError) {
        const needToRepeatRequest = await this.onRequestError(error)
          .then((val) => val)
          .catch((_) => false);

        if (needToRepeatRequest) {
          return await this.makeRequest(requestConfig);
        }
      }

      return handleAxiosError(error);
    }
  }
}
