import { Classes } from '@ikomida/shared-types';
import axios from 'axios';
import iKomidaError from '../Utils/iKomidaError';
import Logger from '../Utils/Logger';

export default class OtimaTel {
  host = 'https://mm.otimatel.com.br/api/v2';
  basic;
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    try {
      this.basic = Buffer.from(`${process.env?.OTIMATELUSER}:${process.env?.OTIMATELPASS}`).toString('base64');
    } catch (exception: any) {
      console.error(exception);
    }
  }

  headers(json = true) {
    let headers = {
      Authorization: `Basic ${this.basic}`,
    };
    if (json) {
      headers = {
        ...headers,
        ...{
          accept: 'application/json',
          'content-type': 'application/json',
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      };
    }
    return headers;
  }

  async send(areaCode: number, phone: number, message: string, id: string) {
    const endPoint = '/sms/';
    try {
      const requestObject = {
        sendSmsRequest: {
          to: `${areaCode}${phone}`,
          message,
          id,
        },
      };
      this.logger.log(requestObject);
      // return {
      //     success: true,
      //     id: null
      // };
      const response = await axios.post<Classes.COtimaTelResponse>(`${this.host}${endPoint}`, requestObject, {
        headers: this.headers(),
      });
      console.log(response?.data);
      if (response.status >= 200 && response.status < 300 && response.data.status === 'success') {
        return {
          success: true,
          id: response?.data?.message?.id ?? null,
        };
      }
      return new iKomidaError(iKomidaError.IKOMIDA_OTIMATEL_SEND_ERROR, JSON.stringify(response?.data)).logAndReturn(this.logger);
    } catch (exception: any) {
      return new iKomidaError(iKomidaError.IKOMIDA_OTIMATEL_SEND_EXCEPTION,
        axios.isAxiosError(exception) ? exception.response?.data : exception,
      ).logAndReturn(this.logger);
    }
  }
}
