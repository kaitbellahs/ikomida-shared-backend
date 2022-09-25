import axios, { AxiosError, AxiosResponseHeaders } from 'axios';
import iKomidaError, { IiKomidaErrorModel } from '../Utils/iKomidaError';
import Logger from '../Utils/Logger';
import convert from 'xml-js';
import { Classes, Types } from '@ikomida/shared-types';

export type IHeaders = AxiosResponseHeaders & {
  Authorization: string;
  'X-Requested-With': string;
  accept?: string;
  'content-type'?: string;
  X_CLIENT_ID?: string;
  X_CLIENT_SECRET?: string;
};
const host: any = {
  development: 'https://dev.ikomida.com/',
  homologation: 'https://hmlg.ikomida.com/',
  production: 'https://ikomida.com/',
}
export default class PagSeguro {
  email?: string | null;
  accessToken?: string;
  hostAPI = 'https://sandbox.api.pagseguro.com';
  logger: Logger;
  app?: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse;
  redirectUri = 'https://dev.ikomida.com/callback';
  host = 'https://dev.ikomida.com/';
  webhooks = 'webhooks/pagseguro/';
  production: boolean;

  constructor(
    logger: Logger,
    email?: string,
    accessToken?: string,
    app?: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse
  ) {
    this.app = app;
    this.email = email;
    this.accessToken = accessToken;
    this.production = process.env.NODE_ENV === 'production';
    this.host = host[process.env.NODE_ENV ?? 'development'];
    this.hostAPI = !this.production ? 'https://sandbox.api.pagseguro.com' : 'https://api.pagseguro.com';
    this.redirectUri = `${this.host}/callback`;
    this.logger = logger;
  }

  headers(json = true, clientID?: string, clientSecret?: string): IHeaders {
    const headers: IHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      'X-Requested-With': 'iKomida-PS-V0.0.1-beta',
    };
    if (json) {
      headers.accept = 'application/json';
      headers['content-type'] = 'application/json';
    }
    if (clientID && clientSecret) {
      headers['X_CLIENT_ID'] = clientID;
      headers['X_CLIENT_SECRET'] = clientSecret;
    }
    return headers;
  }

  async getNotification(notificationCode: string) {
    const paymentStatus = [
      Types.TPagSeguroPaymentStatus.UNKNOWN,
      Types.TPagSeguroPaymentStatus.WAITING,
      Types.TPagSeguroPaymentStatus.INANALYSE,
      Types.TPagSeguroPaymentStatus.PAID,
      Types.TPagSeguroPaymentStatus.PAID,
      Types.TPagSeguroPaymentStatus.IN_DISPUTE,
      Types.TPagSeguroPaymentStatus.REFUNDED,
      Types.TPagSeguroPaymentStatus.CANCELED,
      Types.TPagSeguroPaymentStatus.CHARGEBACK,
      Types.TPagSeguroPaymentStatus.IN_CONTESTATION,
      Types.TPagSeguroPaymentStatus.ONRETURN,
    ];
    try {
      const url = `https://ws${!this.production ? '.sandbox' : ''
        }.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${this.email}&token=${this.accessToken
        }`;
      const response = await axios.get<string>(url);
      if (!this.production) {
        this.logger.logRequest('GET', url, response?.headers, response?.status, response?.data);
      }
      if (response.status >= 200 && response.status < 300) {
        const data = JSON.parse(
          convert.xml2json(response?.data, {
            compact: true,
            spaces: 2,
          }),
        );
        let index = Number(data.transaction.status._text);
        index = isNaN(index) ? 0 : index;
        return Classes.Pagseguro.CChargeResponse.init('', '', '', '', data?.transaction?.reference?._text, data.reference_id, index < (paymentStatus?.length ?? 0) ? paymentStatus[index]
          : undefined, Number(data?.transaction?.grossAmount?._text), `CHAR_${data?.transaction?.code?._text}`);
      }
    } catch (exception: any) {
      return this.handleException(exception)
    }
    return null;
  }

  async createApp(site: string, logo: string) {
    const request: Classes.Pagseguro.CPgseguroCreateOAuth2AppRequest = Classes.Pagseguro.CPgseguroCreateOAuth2AppRequest.init(
      'iKomida',
      'Applicação para receber cobranças dos clientes dos nossos pareceiros',
      site,
      this.redirectUri,
      logo,
    );
    try {
      if (this.production) {
        return false
      }
      const url = `${this.hostAPI}/oauth2/application`;
      const response = await axios.post(url, request.toJSON(), {
        headers: this.headers(),
      });
      if (!this.production) {
        this.logger.logRequest(
          'POST',
          url,
          response?.headers,
          response?.status,
          response?.data,
          this.headers(false),
          request,
        );
      }
      const data: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse = Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse.fromObject(response.data);
      if (response.status >= 200 && response.status < 300 && data?.client_id) {
        this.app = data;
        return this.app;
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, data.toJSON());
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_CREATE_APP_FAILED_1)
    }
    return false;
  }

  async getApp(clientID: string) {
    try {
      const url = `${this.hostAPI}/oauth2/application/${clientID}`;
      const response = await axios.get(url, {
        headers: this.headers(false),
      });
      const data: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse = Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse.fromObject(response.data);
      if (!this.production) {
        this.logger.logRequest('GET', url, response?.headers, response?.status, data, this.headers(false));
      }
      if (response.status >= 200 && response.status < 300) {
        this.app = data;
        return this.app;
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, data.toJSON());
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_GET_APP_FAILED_1)
    }
    return false;
  }

  private handleException(exception: any, errorModel?: IiKomidaErrorModel) {
    if (errorModel) {
      const error = new iKomidaError(errorModel,
        axios.isAxiosError(exception) ? exception.response?.data : exception,
      );
      error.log(this.logger);
    }
    let errors: Classes.Pagseguro.CPagSeguroErrorResponse = Classes.Pagseguro.CPagSeguroErrorResponse.fillWith(null)
    if (axios.isAxiosError(exception)) {
      errors = Classes.Pagseguro.CPagSeguroErrorResponse.fromObject(exception.response?.data)
      this.logger.error(errors?.toJSON())
      return errors.error_messages?.[0]?.code === 41008 ? null : false;
    } else {
      this.logger.error(exception)
    }
    return false;
  }

  generateConnectUrl(state?: string | undefined) {
    const url = `https://connect${!this.production ? '.sandbox' : ''
      }.pagseguro.uol.com.br/oauth2/authorize?response_type=code&client_id=${this.app?.client_id
      }&redirect_uri=${encodeURIComponent(
        this.app?.redirect_uri ?? '',
      )}&scope=payments.read+payments.create+payments.refund+accounts.read&state=${encodeURIComponent(String(state))}`;
    this.logger.log(`Pagseguro connect Url: ${url}`);
    return url;
  }

  async getAccessToken(code?: string): Promise<Classes.Pagseguro.CPagSeguroGetAccessTokenResponse | false | null> {
    const request: Classes.Pagseguro.CPagseguroGetAccessTokenRequest = Classes.Pagseguro.CPagseguroGetAccessTokenRequest.init(
      Types.Pagseguro.TPagseguroGetAccessTokenGrant.AUTHORIZATION_CODE,
      code,
      undefined,
      this.app?.redirect_uri,
    );
    try {
      const url = `${this.hostAPI}/oauth2/token`;
      const response = await axios.post(url, request.toJSON(), {
        headers: this.headers(true, this.app?.client_id, this.app?.client_secret),
      });
      const data: Classes.Pagseguro.CPagSeguroGetAccessTokenResponse = Classes.Pagseguro.CPagSeguroGetAccessTokenResponse.fromObject(response.data);
      if (!this.production) {
        this.logger.logRequest(
          'POST',
          url,
          response?.headers,
          response?.status,
          data.toJSON(),
          this.headers(true, this.app?.client_id, this.app?.client_secret),
          request,
        );
      }
      if (response.status >= 200 && response.status < 300 && data.access_token) {
        return data;
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, data.toJSON());
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_GET_ACCESS_TOKEN_FAILED_1)
    }
    return false;
  }

  async refreshAccessToken(refreshToken: string): Promise<Classes.Pagseguro.CPagSeguroGetAccessTokenResponse | false | null> {
    try {
      const request: Classes.Pagseguro.CPagseguroGetAccessTokenRequest = Classes.Pagseguro.CPagseguroGetAccessTokenRequest.init(
        Types.Pagseguro.TPagseguroGetAccessTokenGrant.REFRESH_TOKEN,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        `${refreshToken}`,
      );
      const url = `${this.hostAPI}/oauth2/refresh`;
      const response = await axios.post(url, request.toJSON(), {
        headers: this.headers(true, this.app?.client_id, this.app?.client_secret),
      });
      const data: Classes.Pagseguro.CPagSeguroGetAccessTokenResponse = Classes.Pagseguro.CPagSeguroGetAccessTokenResponse.fromObject(response.data);
      if (!this.production) {
        this.logger.logRequest(
          'POST',
          url,
          response?.headers,
          response?.status,
          response?.data,
          this.headers(true, this.app?.client_id, this.app?.client_secret),
          request,
        );
      }
      if (response.status >= 200 && response.status < 300) {
        return data;
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, response?.data);
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_REFRESH_ACCESS_TOKEN_FAILED_1)
    }
    return false;
  }

  async revokeToken() {
    try {
      const url = `${this.hostAPI}/oauth2/revoke`;
      const request: Classes.Pagseguro.CPagSeguroRevokeAccessTokenRequest = Classes.Pagseguro.CPagSeguroRevokeAccessTokenRequest.init(
        Types.Pagseguro.TPagseguroGetAccessTokenHint.ACCESS_TOKEN,
        this.accessToken ?? '',
      );
      const response = await axios.post<void>(url, request.toJSON(), {
        headers: this.headers(true, this.app?.client_id, this.app?.client_secret),
      });
      if (!this.production) {
        this.logger.logRequest(
          'POST',
          url,
          response?.headers,
          response?.status,
          response?.data,
          this.headers(true, this.app?.client_id, this.app?.client_secret),
          request,
        );
      }
      if (response.status >= 200 && response.status < 300) {
        return true;
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, response?.data);
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_CREATE_REVOKE_TOKEN_FAILED_1)
    }
    return false;
  }

  async createCharge(
    payload: Classes.Pagseguro.CPagSeguroCreateCharge,
    generateCardToken = false,
  ) {
    let card: Classes.Pagseguro.CPagSeguroCard = Classes.Pagseguro.CPagSeguroCard.fromObject({
      id: payload.cardToken,
    });
    if (generateCardToken) {
      card = Classes.Pagseguro.CPagSeguroCard.fromObject({
        number: payload.card?.number,
        exp_month: payload.card?.exp_month,
        exp_year: payload.card?.exp_year,
        security_code: payload.card?.security_code ?? 0,
        holder: {
          name: payload.card?.holder?.name ?? '',
        },
        store: true,
      });
    }
    const request: Classes.Pagseguro.CPagSeguroChargeRequest = Classes.Pagseguro.CPagSeguroChargeRequest.fromObject({
      amount: {
        value: Math.ceil(Number(`${payload.amount}`?.substring(0, 9))),
        currency: 'BRL',
      },
      reference_id: payload.reference,
      description: payload.description?.substring(0, 64),
      payment_method: {
        type: payload.type.id,
        installments: 1,
        capture: true,
        soft_descriptor: payload.statementID,
        card,
      },
      notification_urls: [
        `${this.host}${this.webhooks}${payload.contractID}`.replace(/([^:]\/)\/+/g, '$1'),
      ],
      metadata: {
        contractID: payload.contractID,
        reference: payload.reference,
      },
    });
    try {
      const url = `${this.hostAPI}/charges`;
      const response = await axios.post(url, request.toJSON(), {
        headers: this.headers(),
      });
      const data: Classes.Pagseguro.CPagSeguroChargeResponse = Classes.Pagseguro.CPagSeguroChargeResponse.fromObject(response.data);
      if (!this.production) {
        this.logger.logRequest('POST', url, response?.headers, response?.status, response?.data, this.headers(), request);
      }
      const paymentStatus = data?.status;
      if (
        response.status >= 200 &&
        response.status < 300 &&
        paymentStatus &&
        ![Types?.TPagSeguroPaymentStatus.DECLINED, Types?.TPagSeguroPaymentStatus.CANCELED].includes(paymentStatus)
      ) {
        const paymentMethod = data.payment_method?.card;
        return Classes.Pagseguro.CChargeResponse.init(paymentMethod?.id, paymentMethod?.brand, paymentMethod?.first_digits, paymentMethod?.last_digits, data.reference_id, data.reference_id, data.status, data.amount?.value, data.id);
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_2, data.toJSON());
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_CREATE_CHARGE_FAILED_1)
    }
    return false;
  }

  async cancelCharge(
    payload: Classes.Pagseguro.CPagSeguroCreateCharge,
  ): Promise<null | false | Classes.Pagseguro.CChargeResponse> {
    try {
      const request: Classes.Pagseguro.CPagSeguroChargeRequest = Classes.Pagseguro.CPagSeguroChargeRequest.fromObject({
        amount: {
          value: `${Math.ceil(payload.amount ?? 0)}`,
          currency: 'BRL',
        },
      });
      const url = `${this.hostAPI}/charges/${payload.id}/cancel`;
      const response = await axios.post<Classes.Pagseguro.CPagSeguroChargeResponse>(url, request.toJSON(), {
        headers: this.headers(),
      });
      const data: Classes.Pagseguro.CPagSeguroChargeResponse = Classes.Pagseguro.CPagSeguroChargeResponse.fromObject(response.data);
      if (!this.production) {
        this.logger.logRequest('POST', url, response?.headers, response?.status, response?.data, this.headers(), request);
      }
      const paymentStatus = data?.status;
      if (
        response.status >= 200 &&
        response.status < 300 &&
        paymentStatus &&
        [Types?.TPagSeguroPaymentStatus.CANCELED].includes(paymentStatus)
      ) {
        const paymentMethod = data.payment_method?.card;
        return Classes.Pagseguro.CChargeResponse.init(paymentMethod?.id, paymentMethod?.brand, paymentMethod?.first_digits, paymentMethod?.last_digits, data.metadata?.contractID, data.reference_id, data.status, data.amount?.value, data.id);
      }
      const error = new iKomidaError(iKomidaError.PAGSEGURO_CANCEL_CHARGE_FAILED_2);
      error.log(this.logger);
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.PAGSEGURO_CANCEL_CHARGE_FAILED_1)
    }
    return false;
  }

  paymentType(type: any) {
    switch (type) {
      case Types.TPaymentMethod.CREDIT_CARD_ONLINE:
        return Types.Pagseguro.TPagSeguroPaymentMethod.CREDIT_CARD.id;
      case Types.TPaymentMethod.DEBT_CARD_ONLINE:
        return Types.Pagseguro.TPagSeguroPaymentMethod.DEBIT_CARD.id;
      default:
        return '';
    }
  }
}
