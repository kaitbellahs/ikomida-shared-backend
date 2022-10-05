import { DateTime } from '@ikomida/shared-logics'
import { Classes } from '@ikomida/shared-types'
import Logger from '../Utils/Logger.js'
import PagSeguro from '../GateWays/PagSeguro.js'
import { VendorPaymentGatewayModel } from '../Domain/Models/index.js'

const hostPrefixes: any = {
  development: 'dev/',
  homologation: 'hmlg',
  production: ''
}

export default class PagseguroHelper {
  logger: Logger
  host?: string
  uri?: string
  prefix: string
  constructor(logger: Logger) {
    this.logger = logger
    this.prefix = hostPrefixes[process.env.NODE_ENV ?? 'development']
  }

  async createApp() {
    const host = `https://${this.prefix}.ikomida.com`
    const pagSeguroEmail = process.env?.PAGSEGURO_EMAIL
    const pagSeguroToken = process.env?.PAGSEGURO_TOKEN
    const paymentGateway = new PagSeguro(this.logger, pagSeguroEmail, pagSeguroToken, undefined)
    if (!pagSeguroEmail || !pagSeguroToken) {
      return false
    }
    const pagseguroLogo = `https://${this.prefix}.ikomida.com/assets/icons/logo-pagseguro.png`
    const response = await paymentGateway?.createApp(host, pagseguroLogo)
    if (!response) {
      return false
    }
    return response
  }

  async configure(vendorPaymentGatewayModel?: VendorPaymentGatewayModel) {
    try {
      const pagSeguroApp: Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse =
        Classes.Pagseguro.CPgseguroCreateOAuth2AppResponse.fromObject(
          JSON.parse(Buffer.from(process.env.PAGSEGURO_APP ?? '', 'base64').toString() ?? '{}')
        )
      const pagSeguroEmail = process.env?.PAGSEGURO_EMAIL
      const pagSeguroToken = process.env?.PAGSEGURO_TOKEN
      let paymentGateway = new PagSeguro(this.logger, pagSeguroEmail, pagSeguroToken, pagSeguroApp)
      if (!vendorPaymentGatewayModel?.data) {
        return paymentGateway
      }
      const gatewayData: Classes.Pagseguro.CPagSeguroGetAccessTokenResponse =
        Classes.Pagseguro.CPagSeguroGetAccessTokenResponse.fromObject(vendorPaymentGatewayModel?.data)
      if (
        new Date(DateTime?.localDate().toString()).getTime() >
        gatewayData?.expires_in + vendorPaymentGatewayModel?.updatedAt?.getTime() &&
        gatewayData.refresh_token
      ) {
        const response = await paymentGateway?.refreshAccessToken(gatewayData?.refresh_token)
        if (response) {
          vendorPaymentGatewayModel.data = response
          await vendorPaymentGatewayModel.save()
        } else if (!gatewayData) {
          vendorPaymentGatewayModel.data = undefined
          await vendorPaymentGatewayModel.save()
        } else {
          return false
        }
      }
      paymentGateway = new PagSeguro(this.logger, undefined, gatewayData?.access_token, pagSeguroApp)
      return paymentGateway
    } catch (exception: any) {
      this.logger.error(exception)
    }
    return false
  }
}
