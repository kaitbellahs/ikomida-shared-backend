import Logger from '../Utils/Logger';
import iKomidaError from '../Utils/iKomidaError';
import NodeMailjet, { Client, SendEmailV3_1 } from 'node-mailjet';
import { TRequestData } from 'node-mailjet/declarations/request/IRequest';
import axios from 'axios';
import { Classes } from '@ikomida/shared-types';
export default class Mailjet {
  provider: Client;
  logger: Logger;

  constructor(logger: Logger) {
    this.provider = new NodeMailjet({
      apiKey: process.env?.MAILJET_APIKEY,
      apiSecret: process.env?.MAILJET_SECRETKEY,
    });
    this.logger = logger;
  }

  async send(object: Classes.CEmail) {
    try {
      const emails: SendEmailV3_1.IBody = {
        Messages: [
          {
            From: {
              Email: object?.from?.email ?? '',
              Name: object?.from?.name,
            },
            To: [
              {
                Email: object?.to?.email ?? '',
                Name: object?.to?.name,
              },
            ],
            TemplateErrorReporting: {
              Email: 'reporter@tialtonivel.com.br',
              Name: 'Reporter',
            },
            Subject: object?.message?.subject,
            HTMLPart: object?.message?.body,
            TextPart: object?.message?.body, //TODO: -- remove html tags
          },
        ],
      };
      const result: SendEmailV3_1.IResponse = (await this.provider
        .post('send', {
          version: 'v3.1',
        })
        .request(emails as unknown as TRequestData)) as unknown as SendEmailV3_1.IResponse;
      if (result?.Messages?.[0]?.Status === 'success') {
        return true;
      } else {
        new iKomidaError(iKomidaError.MAILJET_SEND_EMAIL_ERROR_RESPONSE, result).log(this.logger);
      }
    } catch (exception) {
      new iKomidaError(
        iKomidaError.MAILJET_SEND_EMAIL_EXCEPTION,
        axios.isAxiosError(exception) ? exception.response?.data : exception,
      ).log(this.logger);
    }
    return false;
  }
}
