import * as SqlDB from '../Domain/SqlDB';
import SettingModel from '../Domain/Models/SettingModel';
import { DateTime } from '@ikomida/shared-logics';
import Logger from '../Utils/Logger';
import PagSeguro from '../GateWays/PagSeguro';
import { VendorPaymentGatewayModel } from '../Domain/Models';
import { Classes } from '@ikomida/shared-types';

export default class PagseguroHelper {
  logger: Logger;
  host?: string;
  uri?: string;
  constructor(logger: Logger) {
    this.logger = logger;
  }

  async configure(vendorPaymentGatewayModel?: VendorPaymentGatewayModel) {
    try {
      const settings = await SettingModel.findAll({
        where: {
          [SqlDB.Op.or]: [
            {
              name: 'host',
            },
            {
              name: 'pagseguroLogo',
            },
            {
              name: 'pagSeguroApp',
            },
          ],
        },
      });
      let pagSeguroApp: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse = Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse.fromObject(
        JSON.parse(settings?.filter((setting) => setting.name === 'pagSeguroApp')?.[0]?.value ?? '{}'),
      );
      const host = settings?.filter((setting) => setting.name === 'host')?.[0]?.value ?? 'https://hmlg.ikomida.com';
      const pagseguroLogo =
        settings?.filter((setting) => setting.name === 'pagseguroLogo')?.[0]?.value ??
        'https://hmlg.ikomida.com/assets/icons/logo-pagseguro.png';
      const production = process.env.NODE_ENV === 'production';
      const pagSeguroEmail = process.env?.PAGSEGURO_EMAIL;
      const pagSeguroToken = process.env?.PAGSEGURO_TOKEN;

      let paymentGateway = new PagSeguro(this.logger, pagSeguroEmail, pagSeguroToken, undefined);
      if ((!pagSeguroApp || !pagSeguroApp.client_id?.trim()) && !production) {
        if (!pagSeguroEmail || !pagSeguroToken) {
          return false;
        }
        const response = await paymentGateway?.createApp(host, pagseguroLogo);
        if (!response) {
          return false;
        }
        await SettingModel.create({
          name: 'pagSeguroApp',
          value: JSON.stringify(response.toJSON()),
          type: 'TEXT',
        });
        pagSeguroApp = response;
      }
      paymentGateway = new PagSeguro(this.logger, pagSeguroEmail, pagSeguroToken, pagSeguroApp);
      if (!vendorPaymentGatewayModel?.data) {
        return paymentGateway;
      }
      const gatewayData: Classes.Pagseguro.CPagSeguroGetAccessTokenResponse = Classes.Pagseguro.CPagSeguroGetAccessTokenResponse.fromObject(vendorPaymentGatewayModel?.data);
      if (
        new Date(DateTime?.localDate().toString()).getTime() >
        gatewayData?.expires_in + vendorPaymentGatewayModel?.updatedAt?.getTime()
        && gatewayData.refresh_token
      ) {
        const response = await paymentGateway?.refreshAccessToken(gatewayData?.refresh_token);
        if (response) {
          vendorPaymentGatewayModel.data = response;
          await vendorPaymentGatewayModel.save();
        } else if (!gatewayData) {
          vendorPaymentGatewayModel.data = undefined;
          await vendorPaymentGatewayModel.save();
        } else {
          return false;
        }
      }
      paymentGateway = new PagSeguro(this.logger, undefined, gatewayData?.access_token, pagSeguroApp);
      return paymentGateway;
    } catch (exception: any) {
      this.logger.error('Ocorreu um erro inespirado:');
      console.error(exception);
    }
    return false;
  }
}
