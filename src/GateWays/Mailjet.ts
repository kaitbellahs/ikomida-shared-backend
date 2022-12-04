import MailjetClient from 'node-mailjet'
import { TRequestData } from 'node-mailjet/declarations/request/IRequest.js'
import axios from 'axios'
import { Classes } from '@ikomida/shared-types'
import Logger from '../Utils/Logger.js'
import iKomidaError from '../Utils/iKomidaError.js'
export default class Mailjet {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private provider: MailjetClient
  private logger: Logger

  constructor(logger: Logger) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.provider = new MailjetClient({
      apiKey: process.env?.MAILJET_APIKEY,
      apiSecret: process.env?.MAILJET_SECRETKEY
    })
    this.logger = logger
  }

  async send(object: Classes.CEmail) {
    try {
      const emails: TRequestData = {
        Messages: [
          {
            From: {
              Email: object?.from?.email ?? '',
              Name: object?.from?.name
            },
            To: [
              {
                Email: object?.to?.email ?? '',
                Name: object?.to?.name
              }
            ],
            Subject: object?.message?.subject,
            HTMLPart: object?.message?.body,
            TextPart: object?.message?.body?.replace(/<[^>]*>/g, '')
          }
        ]
      }
      const result = await this.provider
        .post('send', {
          version: 'v3.1'
        })
        .request(emails)
      this.logger.log('result.response.status:', result?.response?.status)
      this.logger.log('result.response.data:', JSON.stringify(result?.response?.data))
      if (result.response.status >= 200 && result.response.status < 300) {
        return true
      } else {
        new iKomidaError(iKomidaError.MAILJET_SEND_EMAIL_ERROR_RESPONSE, result).log(this.logger)
      }
    } catch (exception) {
      new iKomidaError(
        iKomidaError.MAILJET_SEND_EMAIL_EXCEPTION,
        axios.isAxiosError(exception) ? exception.response?.data : exception
      ).log(this.logger)
    }
    return false
  }
}
