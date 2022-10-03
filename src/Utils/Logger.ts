import { DateTime } from '@ikomida/shared-logics';
import { Classes } from '@ikomida/shared-types';
import { AxiosResponseHeaders } from 'axios';
import { IHeaders } from '../GateWays/PagSeguro';

export interface ILoggerMetadata {
  environment: string;
  resource: {
    type: string;
  };
  severity: string;
  message: string;
  errorCode?: string;
  errors?: any[];
}
export abstract class ILoggerObject {
  code: string;
  message: string;
  errors?: string[];
  constructor(code: string, message: string, errors?: string[]) {
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}
export default class Logger {
  service;
  isProd = false;

  constructor(service: string) {
    this.service = service;
    this.isProd = process.env.NODE_ENV === 'production';
    // axios.interceptors.request.use(request => {
    //     this.info(`Starting Request, ${JSON.stringify(request, null, 2)}`)
    //     return request
    // })

    // axios.interceptors.response.use(response => {
    //     this.info(`Response:, ${JSON.stringify(response, null, 2)}`)
    //     return response
    // })
  }

  error(logObject: ILoggerObject | string | any, ...args: any[]) {
    const message: string =
      typeof logObject === 'object' && 'message' in logObject
        ? `${logObject.code}: ${logObject.message}`
        : typeof logObject === 'string'
        ? logObject
        : JSON.stringify(logObject);
    const metadata: ILoggerMetadata = {
      environment: this.isProd ? 'Production' : 'Development',
      resource: { type: 'global' },
      severity: 'ERROR',
      message,
    };
    if (typeof logObject === 'object') {
      metadata.errorCode = logObject.code;
      metadata.errors = logObject.errors;
    }
    this.writeLog(metadata, message, ...args);
  }

  log(logObject: ILoggerObject | string | any, ...args: any[]) {
    this.info(logObject, ...args);
  }

  info(logObject: ILoggerObject | string | any, ...args: any[]) {
    const message: string =
      logObject instanceof ILoggerObject
        ? `${logObject?.code}: ${logObject?.message}`
        : logObject instanceof String
        ? (logObject as string)
        : JSON.stringify(logObject);
    const metadata: ILoggerMetadata = {
      resource: { type: 'global' },
      environment: this.isProd ? 'Production' : 'Development',
      severity: 'INFO',
      message,
    };
    if (typeof logObject === 'object') {
      metadata.errorCode = logObject?.code;
      metadata.errors = logObject?.errors;
    }
    this.writeLog(metadata, message, ...args);
  }

  warn(logObject: ILoggerObject | string | any, ...args: any[]) {
    const message: string =
      logObject instanceof ILoggerObject
        ? `${logObject?.code}: ${logObject?.message}`
        : logObject instanceof String
        ? (logObject as string)
        : JSON.stringify(logObject);
    const metadata: ILoggerMetadata = {
      resource: { type: 'global' },
      environment: this.isProd ? 'Production' : 'Development',
      severity: 'WARNING',
      message,
    };
    if (typeof logObject === 'object') {
      metadata.errorCode = logObject?.code;
      metadata.errors = logObject?.errors;
    }
    this.writeLog(metadata, message, ...args);
  }

  async logRequest(
    method: string,
    url: string,
    responseHeaders: AxiosResponseHeaders,
    responseStatus: number,
    responseData: string | Classes.Pagseguro.CPagSeguroConnectTokenResponse | void,
    requestHeaders?: IHeaders,
    requestData?: any,
  ) {
    return new Promise((resolve) => {
      console.log(
        `iKLogger|${DateTime.now()}: [${this.service}[${process.env?.NODE_APP_INSTANCE ?? '-'}]] [INFO]: Request:`,
      );
      console.log('-*-*-*-*-*-*-*-*-*-*-');
      console.log('Request :', method, ' : ', `${url}`);
      console.log('Request Headers:', requestHeaders);
      console.log('Request data:', requestData);
      console.log('Response Headers:', responseHeaders);
      console.log('Response status:', responseStatus);
      console.log('Response data:', responseData);
      console.log('-*-*-*-*-*-*-*-*-*-*-');
      resolve(true);
    });
  }

  async writeLog(metadata: ILoggerMetadata, message: string, ...args: any[]) {
    return new Promise((resolve) => {
      const log = `iKLogger|${DateTime.now()}: [${this.service}[${process.env.NODE_APP_INSTANCE ?? '-'}]] [${
        metadata.severity
      }]: Message: ${message}`;
      switch (metadata.severity) {
        case 'ERROR':
          console.error(log);
          if (metadata.errors) {
            const error = `iKLogger|${DateTime.now()}: [${this.service}[${process.env.NODE_APP_INSTANCE ?? '-'}]] [${
              metadata.severity
            }]: Error:`;
            console.error(error, ...metadata.errors);
          }
          if ((args?.length ?? 0) > 0) {
            console.log(...args);
          }
          break;
        case 'WARNING':
          console.warn(log);
          if ((args?.length ?? 0) > 0) {
            console.log(...args);
          }
          break;
        default:
          console.log(log);
          if ((args?.length ?? 0) > 0) {
            console.log(...args);
          }
          break;
      }
      resolve(true);
    });
  }

  static instance: any;
  static getInstance(service: string) {
    if (!Logger.instance) {
      Object.defineProperty(Logger, 'instance', {
        value: new Logger(service),
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
    return Logger.instance;
  }
}
