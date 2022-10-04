import axios from 'axios'
import Logger from './Logger'
export default class ReCaptcha {
  apiKey: string
  logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
    this.apiKey = process.env?.RECAPTCHA_SECRET ?? ''
  }

  async validate(token: string, remoteip: string) {
    const uri = `https://www.google.com/recaptcha/api/siteverify?secret=${this.apiKey}&response=${token}&remoteip=${remoteip}`
    try {
      const response = await axios.post(`${uri}`, {
        headers: {
          'X-Requested-With': 'iKomida-PS-V0.0.1'
        }
      })
      if (response.status >= 200 && response.status < 300) {
        return response?.data
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`)
      } else {
        this.logger.error(`StatusCode: ${JSON.stringify(error)}`)
      }
    }
    return {
      success: false
    }
  }
}
