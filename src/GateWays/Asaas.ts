import axios from 'axios'
import * as Logics from '@ikomida/shared-logics'
import { Classes, Types } from '@ikomida/shared-types'
import iKomidaError, { IiKomidaErrorModel } from '../Utils/iKomidaError.js'
import Logger from '../Utils/Logger.js'
import Return from '../Utils/Return.js'
import pkg from '../../package.json' assert { type: 'json' }
export default class Asaas {
  accessToken: string
  production = false
  host
  name = 'Asaas'
  logger
  constructor(logger: Logger) {
    this.logger = logger
    this.production = process.env.NODE_ENV === 'production'
    this.host = !this.production ? 'https://sandbox.asaas.com' : 'https://www.asaas.com'
    this.accessToken = process.env.ASAAS_TOKEN ?? ''
  }

  private headers() {
    return {
      access_token: this.accessToken,
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-Requested-With': `iKomida-sl-V${pkg.version}`,
      'user-agent': `iKomida/sl V${pkg.version}`
    }
  }

  async createNewCustomer(
    input?: Classes.Asaas.CAsaasNewCustomer
  ): Promise<Return<Classes.Asaas.CNewCustomerResponse>> {
    try {
      const endpoint = '/api/v3/customers'
      const request = Classes.Asaas.CNewCustomerResquest.init(
        input?.name ?? '',
        input?.email ?? '',
        input?.phone ?? '',
        input?.identity ?? '',
        undefined,
        input?.address.postalCode,
        input?.address.name,
        input?.address.number,
        input?.address.complement,
        input?.address.province,
        input?.externalReference,
        false,
        undefined,
        undefined,
        undefined,
        input?.observations
      )
      const response = await axios.post(`${this.host}${endpoint}`, request.toJSON(), {
        headers: this.headers()
      })
      const data: Classes.Asaas.CNewCustomerResponse = Classes.Asaas.CNewCustomerResponse.fromObject(response.data)
      if (response.status >= 200 && response.status < 300 && data.id) {
        return new Return(true, data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_2, data.toJSON())
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_3)
      return new Return(false, data)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_1)
    }
  }

  async createNewAccount(input: any): Promise<Return<Classes.Asaas.CAsaasNewAccountResponse>> {
    const endpoint = '/api/v3/accounts'
    try {
      const payload: Classes.Asaas.CAsaasAccount = Classes.Asaas.CAsaasAccount.fromObject(input)
      const request: Classes.Asaas.CNewAccountRequest = Classes.Asaas.CNewAccountRequest.init(
        payload.name ?? '',
        payload.email ?? '',
        payload.identity ?? '',
        payload.birthDate ?? '',
        payload.companyType ?? Types.TCompany.INDIVIDUAL,
        payload.phone ?? '',
        payload.address.name ?? '',
        payload.address.number ?? '',
        payload.address.province ?? '',
        payload.address.postalCode ?? '',
        payload.phone,
        payload.address.complement
      )
      const response = await axios.post(`${this.host}${endpoint}`, request.toJSON(), {
        headers: this.headers()
      })
      const data: Classes.Asaas.CAsaasNewAccountResponse = Classes.Asaas.CAsaasNewAccountResponse.fromObject(
        response.data
      )
      if (response.status >= 200 && response.status < 300 && data?.id) {
        return new Return(true, data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_2, data.toJSON())
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_NEW_CUSTOMER_CREATE_FAILED_1)
    }
  }

  async getSubscription(id: string): Promise<Return<Classes.Asaas.CSubscriptionResponse>> {
    if (!id) {
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_OBJECT)
      error.log(this.logger)
      return new Return(false)
    }
    const endpoint = `/api/v3/subscriptions/${id}`
    try {
      const response = await axios.get(`${this.host}${endpoint}`, {
        headers: this.headers()
      })
      const data: Classes.Asaas.CSubscriptionResponse = Classes.Asaas.CSubscriptionResponse.fromObject(response.data)
      if (response.status >= 200 && response.status < 300 && data?.id) {
        return new Return(true, data)
      }
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, data.toJSON())
      error.log(this.logger)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
    return new Return(false)
  }

  async paymentQrCode(id: string): Promise<Return<Classes.Asaas.CSubscriptionResponse>> {
    if (!id) {
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_OBJECT)
      error.log(this.logger)
      return new Return(false)
    }
    const endpoint = `/pixQrCode/createPaymentQrCode/${id}`
    try {
      const response = await axios.get(`${this.host}${endpoint}`)
      const data: Classes.Asaas.CAsaasPaymentQrCode = Classes.Asaas.CAsaasPaymentQrCode.fromObject(response.data)
      if (response.status >= 200 && response.status < 300 && data?.success) {
        return new Return(true, data)
      }
      const error = new iKomidaError(iKomidaError.ASAAS_PAYMENT_QRCODE_FAILED_2, data.toJSON())
      error.log(this.logger)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_PAYMENT_QRCODE_FAILED_1)
    }
    return new Return(false)
  }

  async getPayments(subscriptionId: string): Promise<Return<Classes.Asaas.CAsaasPayment[]>> {
    if (!subscriptionId) {
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_OBJECT)
      error.log(this.logger)
      return new Return(true, [])
    }
    const endpoint = `/api/v3/payments?subscription = ${subscriptionId}`
    try {
      const response = await axios.get(`${this.host}${endpoint}`, {
        headers: this.headers()
      })
      const data: Classes.Asaas.CAsaasPaymentsResponse = Classes.Asaas.CAsaasPaymentsResponse.fromObject(response.data)
      if (response.status >= 200 && response.status < 300 && data.data) {
        return new Return(true, data?.data)
      }
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, data.toJSON())
      error.log(this.logger)
    } catch (exception: any) {
      this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
    return new Return(false, [])
  }

  async doRecurringSubscription(
    input: any,
    ip: string
  ): Promise<Return<Classes.Asaas.CAsaasCreateSubscriptionResponse>> {
    const endpoint = '/api/v3/subscriptions'
    const payload: Classes.Asaas.CAsaasSubscription = Classes.Asaas.CAsaasSubscription.fromObject(input)
    const customer = await this.createNewCustomer(payload.customer)
    if (!customer.success || !customer.data?.id) {
      const error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_CREATE_CUSTOMER)
      error.log(this.logger)
      new Return(false)
    }
    const nextDueDate = new Date()
    console.log('plan:', payload.plan.toJSON())
    nextDueDate.setDate(nextDueDate.getDate() + (payload.plan?.dueDateAfterXDays ?? 0))
    const localNextDueDate = Logics.DateTime.localDate(nextDueDate.toISOString()).toFormat('yyyy-MM-dd')
    console.log('date:', new Date(), 'dueDate:', localNextDueDate)
    const request = Classes.Asaas.CAsaasCreateSubscriptionRequest.init(
      customer.data?.id ?? '',
      payload.billingType ?? Types.Asaas.TAsaasBilling.CREDIT_CARD,
      localNextDueDate,
      (payload.plan?.price ?? 0) * 0.01,
      Types.Asaas.TAssasSubscriptionCycle.MONTHLY,
      ip,
      payload.billingType === Types.Asaas.TAsaasBilling.CREDIT_CARD
        ? Classes.Asaas.CAsaasCreditCardHolderInfo.init(
            payload.customer?.name ?? '',
            payload.customer?.email ?? '',
            `${payload.customer?.identity ?? ''}`,
            payload.customer?.address.postalCode ?? '',
            payload.customer?.address.number ?? '',
            payload.customer?.address.complement,
            `${payload.customer?.phone ?? ''}`,
            `${payload.customer?.phone ?? ''}`
          )
        : undefined,
      undefined,
      undefined,
      Classes.Asaas.CAsaasDiscount.init(
        (payload.plan?.discount ?? 0) * 0.01,
        payload.plan.discountType === Types.TDiscount.PERCENT
          ? Types.Asaas.TAsaasDiscount.PERCENTAGE
          : payload.plan.discountType === Types.TDiscount.VALUE
          ? Types.Asaas.TAsaasDiscount.FIXED
          : undefined
      ),
      undefined,
      undefined,
      `Contrato iKomida
plano: ${payload.plan?.name}
ikomidaID: ${payload.ikomidaID}`,
      undefined,
      undefined,
      payload.billingType === Types.Asaas.TAsaasBilling.CREDIT_CARD
        ? Classes.Asaas.CAsaasCard.init(
            payload.payment?.holderName ?? '',
            payload.payment?.number ?? 0,
            payload.payment?.expiryMonth ?? 0,
            payload.payment?.expiryYear ?? 0,
            payload.payment?.ccv ?? 0
          )
        : undefined,
      JSON.stringify({
        ikomidaID: payload.ikomidaID
      })
    )
    try {
      const response = await axios.post(`${this.host}${endpoint}`, request.toJSON(), {
        headers: this.headers()
      })
      const data: Classes.Asaas.CAsaasCreateSubscriptionResponse =
        Classes.Asaas.CAsaasCreateSubscriptionResponse.fromObject(response.data)
      if (response.status >= 200 && response.status < 300 && data?.id) {
        return new Return(true, data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, data.toJSON())
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false, data)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  private handleException(exception: any, errorModel: IiKomidaErrorModel) {
    const error = new iKomidaError(errorModel, axios.isAxiosError(exception) ? exception.response?.data : exception)
    error.log(this.logger)
    let errors: Classes.Asaas.CAsaasErrors = Classes.Asaas.CAsaasErrors.fillWith(null)
    if (axios.isAxiosError(exception)) {
      errors = Classes.Asaas.CAsaasErrors.fromObject(exception.response?.data)
    }
    return new Return(false, axios.isAxiosError(exception) ? errors?.toJSON() : exception)
  }

  async createPayment(input: any): Promise<Return<Classes.Asaas.CAsaasPayment>> {
    const endpoint = '/api/v3/payments'
    const payload: Classes.Asaas.CAsaasCreatePayment = Classes.Asaas.CAsaasCreatePayment.fromObject(input)
    const request = new Classes.Asaas.CAsaasRequestPayment({
      customer: payload.customer?.id,
      billingType: payload.type,
      value: `${(payload.amount ?? 0) * 0.01}`,
      description: payload.description?.substring(0, 64),
      externalReference: payload.reference,
      creditCardHolderInfo: {
        name: payload.customer?.name,
        email: payload.customer?.email,
        cpfCnpj: `${payload.customer?.identity}`,
        postalCode: payload.customer?.address.postalCode,
        addressNumber: payload.customer?.address.number,
        addressComplement: payload.customer?.address.complement,
        phone: `${payload.customer?.phone}`,
        mobilePhone: `${payload.customer?.phone}`
      },
      dueDate: Logics.DateTime.localToday(),
      remoteIp: payload.customer?.ip,
      split: {
        walletId: payload.walletId,
        percentualValue: 100
      }
    })
    if (payload.creditCardToken) {
      request.creditCardToken = payload.creditCardToken
    } else {
      request.creditCard = new Classes.Asaas.CAsaasCard({
        holderName: payload.creditCard?.holderName,
        number: payload.creditCard?.number,
        expiryMonth: payload.creditCard?.expiryMonth,
        expiryYear: payload.creditCard?.expiryYear,
        ccv: payload.creditCard?.ccv
      })
    }
    try {
      const response = await axios.post<Classes.Asaas.CAsaasPayment>(`${this.host}${endpoint}`, request.toJSON(), {
        headers: this.headers()
      })

      if (response.status >= 200 && response.status < 300 && response?.data?.id) {
        return new Return(true, response?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  async transfer(input: any): Promise<Return<Classes.Asaas.CAsaasTransferResponse>> {
    const endpoint = '/api/v3/transfers'
    const payload: Classes.Asaas.CAsaasTransfer = Classes.Asaas.CAsaasTransfer.fromObject(input)
    const request = new Classes.Asaas.CAsaasTransferRequest({
      pixAddressKeyType: payload.pixAddressKeyType,
      value: (payload.amount ?? 0) * 0.01,
      description: payload.description?.substring(0, 64),
      pixAddressKey: payload.pixAddressKey
    })
    try {
      const response = await axios.post<Classes.Asaas.CAsaasTransferResponse>(
        `${this.host}${endpoint}`,
        request.toJSON(),
        {
          headers: this.headers()
        }
      )

      if (response.status >= 200 && response.status < 300 && response?.data?.id) {
        return new Return(true, response?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  async refundPayment(id: string): Promise<Return<Classes.Asaas.CAsaasPayment>> {
    const endpoint = `/api/v3/payments/${id}/refund`
    try {
      const response = await axios.post<Classes.Asaas.CAsaasPayment>(`${this.host}${endpoint}`, null, {
        headers: this.headers()
      })

      if (response.status >= 200 && response.status < 300 && response?.data?.id) {
        return new Return(true, response?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  async statments(
    startDate: string,
    finishDate: string,
    offset: string,
    limit: string
  ): Promise<Return<Classes.Asaas.CAsaasStatment[]>> {
    const endpoint = `/api/v3/financialTransactions?startDate=${startDate}&finishDate=${finishDate}&offset=${offset}&limit=${limit}`
    try {
      const response = await axios.post<Classes.Asaas.CAsaasStatmentsResponse>(`${this.host}${endpoint}`, {
        headers: this.headers()
      })

      if (response.status >= 200 && response.status < 300) {
        return new Return(true, response?.data?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  async balance(): Promise<Return<Classes.Asaas.CAsaasBalance>> {
    const endpoint = `/api/v3/finance/balance`
    try {
      const response = await axios.post<Classes.Asaas.CAsaasBalance>(`${this.host}${endpoint}`, {
        headers: this.headers()
      })

      if (response.status >= 200 && response.status < 300) {
        return new Return(true, response?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  async pendingBalance(): Promise<Return<Classes.Asaas.CAsaasStatistics>> {
    const endpoint = `/api/v3/finance/payment/statistics?status=PENDING`
    try {
      const response = await axios.post<Classes.Asaas.CAsaasStatistics>(`${this.host}${endpoint}`, {
        headers: this.headers()
      })

      if (response.status >= 200 && response.status < 300) {
        return new Return(true, response?.data)
      }
      let error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_2, response?.data)
      error.log(this.logger)
      error = new iKomidaError(iKomidaError.ASAAS_SUBSCRIPTION_FAILED_3)
      return new Return(false)
    } catch (exception: any) {
      return this.handleException(exception, iKomidaError.ASAAS_SUBSCRIPTION_FAILED_1)
    }
  }

  paymentType(type: Types.TPaymentMethod) {
    switch (type) {
      case Types.TPaymentMethod.CREDIT_CARD_ONLINE:
        return 'CREDIT_CARD'
      default:
        return ''
    }
  }
}
