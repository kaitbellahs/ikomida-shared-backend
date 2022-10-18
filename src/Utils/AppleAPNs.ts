import { Classes, Types } from '@ikomida/shared-types'
import { CompactSign, importPKCS8 } from 'jose'
import Logger from './Logger.js'
import HTTP2Client from '../Helpers/HTTP2Client.js'
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// const pkg = require('../../package.json')
const pkg = {
  version: '1.0.30'
}
export default class AppleAPNs {
  logger: Logger
  http2Client
  production
  constructor(logger: Logger) {
    this.logger = logger
    this.production = process.env.NODE_ENV === 'production'
    this.http2Client = new HTTP2Client(logger, 'https://api.push.apple.com', 443)
  }

  async generateAccessToken() {
    try {
      const iat = new Date().getTime() / 1000
      const payload = {
        iss: 'XHH8LH5KC4',
        iat
      }
      const algorithm = 'ES256'
      let pkcs8 = ''
      try {
        pkcs8 = Buffer.from(process.env.APPLE_APNS ?? '', 'base64').toString('utf8')
      } catch (exception: any) {
        this.logger.error(exception)
      }
      const ecPrivateKey = await importPKCS8(pkcs8, algorithm)
      return await new CompactSign(new TextEncoder().encode(JSON.stringify(payload)))
        .setProtectedHeader({
          alg: algorithm,
          kid: process.env.APPLE_APNS_KEY
        })
        .sign(ecPrivateKey)
    } catch (error: any) {
      this.logger.error(error)
    }
    return null
  }

  async sendPushNotification(payload: Classes.CNotificationPayload): Promise<Types.TSendReturn> {
    try {
      const token = payload.token
      const apnsid = payload.id
      const priority = payload?.priority
      const ikomidaId = payload?.ikomidaId
      const data = {
        aps: {
          alert: {
            title: payload.notification?.title,
            body: payload.notification?.body
          }
        },
        data: payload.data?.toJSON()
      }
      const headers = await this.headers(apnsid, priority, ikomidaId)
      if (!this.production) {
        this.logger.info('data:', `URL: /3/device/${token?.toLowerCase()}`, 'data:', data, 'headers:', headers)
      }
      const response = await this.http2Client.post(`/3/device/${token?.toLowerCase()}`, headers, data)
      if (!this.production) {
        this.logger.info('response:', JSON.stringify(response))
      }
      if (response?.status >= 200 && response?.status < 300) {
        return { code: 0, id: response?.headers?.['apns-id'] }
      }
    } catch (error: any) {
      this.logger.error(error)
    }
    return { code: -1 }
  }
  async headers(apnsid?: string, priority?: number, ikomidaId?: string) {
    const apnsExpiration = Math.floor(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000)
    const headers = {
      authorization: `bearer ${await this.generateAccessToken()}`,
      'apns-push-type': `alert`,
      'apns-id': apnsid ?? '',
      'apns-expiration': apnsExpiration,
      'apns-priority': priority ?? '',
      'apns-topic': ikomidaId ?? '',
      'X-Requested-With': `iKomida Publisher V${pkg.version}`
    }
    return headers
  }
}
