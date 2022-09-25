import { Classes, Types } from '@ikomida/shared-types';
import axios from 'axios';
import https from 'https';
import { CompactSign, importPKCS8 } from 'jose';
import Logger from './Logger';

export default class AppleAPNs {
  logger: Logger;
  production;
  api;

  constructor(logger: Logger) {
    this.logger = logger;
    this.production = process.env.NODE_ENV === 'production';

    const httpsAgent = new https.Agent({ keepAlive: true });
    this.api = axios.create({
      baseURL: this.production ? 'https://api.push.apple.com:443' : 'https://api.sandbox.push.apple.com:443',
      httpsAgent,
    });
  }

  async generateAccessToken() {
    try {
      const iat = new Date().getTime() / 1000;
      const payload = {
        iss: 'XHH8LH5KC4',
        iat,
      };
      const algorithm = 'ES256';
      let pkcs8 = '';
      try {
        pkcs8 = Buffer.from(process.env.APPLE_APNS ?? '', 'base64').toString('utf8');
      } catch (exception: any) {
        this.logger.error(exception);
      }
      const ecPrivateKey = await importPKCS8(pkcs8, algorithm);
      return await new CompactSign(new TextEncoder().encode(JSON.stringify(payload)))
        .setProtectedHeader({
          alg: algorithm,
          kid: process.env.APPLE_APNS_KEY,
        })
        .sign(ecPrivateKey);
    } catch (error: any) {
      this.logger.error(error);
    }
    return null;
  }
  async sendPushNotification(payload?: Classes.CNotificationPayload): Promise<Types.TSendReturn> {
    try {
      const token = payload?.token;
      const apnsid = payload?.id;
      const priority = payload?.priority;
      const ikomidaId = payload?.ikomidaId;
      const data = {
        aps: {
          alert: {
            title: payload?.notification?.title,
            body: payload?.notification?.body,
          },
        },
        data: payload?.data,
      };
      const options = {
        headers: await this.headers(apnsid, priority, ikomidaId),
      };
      const response = await this.api.post(`/3/device/${token}`, data, options);
      this.logger.info('data:', JSON.stringify(response?.data));
      if (response?.status >= 200 && response?.status < 300) {
        return { code: 0, id: response?.headers?.['apns-id'] };
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`);
      } else {
        this.logger.error(`StatusCode: ${JSON.stringify(error)}`);
      }
    }
    return { code: -1 };
  }
  async headers(apnsid: any, priority: any, ikomidaId: any) {
    const apnsExpiration = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000;
    const headers = {
      authorization: `bearer ${await this.generateAccessToken()}`,
      'apns-push-type': `alert`,
      'apns-id': apnsid,
      'apns-expiration': apnsExpiration,
      'apns-priority': priority,
      'apns-topic': ikomidaId,
      'X-Requested-With': `iKomida Publisher V0.0.1`,
    };
    return headers;
  }
}
