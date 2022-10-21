import { Classes } from '@ikomida/shared-types'
import RabbitMQ from '../Domain/RabbitMQ.js'
import Logger from './Logger.js'

export default class Notification extends Classes.CNotification {
  private _object: Classes.CNotification

  constructor(object: Classes.CNotification, ...args: any[]) {
    super(object)
    this._object = object
    this.title = object?.title ?? ''
    this.body = object?.body ?? ''
    if ((args?.length ?? 0) > 0) {
      this.body =
        this.body?.replace(/{(\d+)}/g, (match: string, index: number) =>
          args?.[index] ? String(args[index]) : match
        ) ?? this.body
    }
  }

  get object() {
    return this._object
  }

  static async sendNotification(
    logger: Logger,
    input: Classes.CNotification,
    orderId?: string,
    contractId?: string,
    userId?: string,
    ...args: any[]
  ) {
    const notification: Classes.CNotification = Classes.CNotification.fromObject(input)
    const managedNotification = new Notification(notification, ...args)
    const message = new Classes.CNotificationPayload()
    message.notification = managedNotification
    message.data = new Classes.CNotificationData()
    message.data.method = managedNotification.method
    message.data.uri = managedNotification.uri
    message.data.logon = managedNotification.logon
    message.data.payload = orderId
    const payload = new Classes.CAMQPPayload<Classes.CAMQPPayloadObject>()
    payload.method = 'send'
    const payloadObject = new Classes.CAMQPPayloadObject()
    payloadObject.message = message
    payloadObject.contractId = contractId
    if (userId) {
      payloadObject.userId = userId
    }
    payload.object = payloadObject

    const amqp = new RabbitMQ(logger)
    await amqp?.publish(RabbitMQ.PUSH_NOTIFICATION_QUEUE, payload)
    await amqp?.close()
  }

  static NEW_ORDER = Classes.CNotification.init(
    'Novo pedido',
    'Você recebeu um novo pedido, não deixe seu cliente esperando ;)',
    'newOrder',
    '/order/',
    'true'
  )
  static USER_ORDER_UPDATED = Classes.CNotification.init(
    'Seu pedido foi atualizado',
    'O seu pedido foi alterado para "{0}"',
    'orderUpdate',
    '/order/',
    'true'
  )
  static VENDOR_ORDER_UPDATED = Classes.CNotification.init(
    'Um pedido foi atualizado',
    'O pedido N˚:{0} foi alterado para "{1}"',
    'orderUpdate',
    '/order/',
    'true'
  )
  static ORDER_STATUS = Classes.CNotification.init(
    'Um pedido foi atualizado',
    'O pagamento do pedido N˚:{0} foi alterada para "{0}"',
    'orderStatus',
    '/order/',
    'true'
  )
  static NEW_CHARGE = Classes.CNotification.init(
    'Atualização da cobrança',
    'A cobrança mensal do seu contrato foi alterada',
    'newCharge',
    '/subscription/',
    'true'
  )
  static VENDOR_MESSAGE = Classes.CNotification.init('', '', 'newVendorNotification', '/vendorNotification/', 'true')
}
