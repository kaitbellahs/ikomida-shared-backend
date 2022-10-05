import { Classes, Types } from '@ikomida/shared-types'
import amqpLib, { Connection, Channel, ConsumeMessage } from 'amqplib'
import iKomidaError from '../Utils/iKomidaError.js'
import Logger from '../Utils/Logger.js'
import MicroService from './MicroService.js'
export default class RabbitMQ {
  channel?: Channel | null
  logger: Logger
  connection?: Connection

  static PAYMENT_QUEUE = 'PAYMENT_QUEUE'
  static PUSH_NOTIFICATION_QUEUE = 'PUSH_NOTIFICATION_QUEUE'
  static VENDOR_PUSH_NOTIFICATION_QUEUE = 'VENDOR_PUSH_NOTIFICATION_QUEUE'
  static EMAIL_QUEUE = 'EMAIL_QUEUE'
  static SMS_QUEUE = 'SMS_QUEUE'
  static APPS_QUEUE = 'APPS_QUEUE'
  static REFERRAL_QUEUE = 'REFERRAL_QUEUE'

  constructor(logger: Logger) {
    this.logger = logger
  }

  async getChannel(queue: string, toListen = false): Promise<Channel | null> {
    try {
      if (!this.channel) {
        const connectionObject = {
          hostname: MicroService.mq ?? '127.0.0.1',
          username: process.env?.MQUSER ?? 'ikomida',
          password: process.env?.MQPASS ?? 'iKomida@123',
          vhost: process.env?.MQVHOST ?? 'ikomida'
        }
        this.connection = await amqpLib.connect(connectionObject)
        this.channel = await this.connection?.createChannel()
        await this.channel?.assertQueue(queue, {
          durable: true
        })
        if (toListen) {
          await this.channel?.prefetch(1)
        }
      }
      return this.channel
    } catch (exception: any) {
      new iKomidaError(iKomidaError.MQ_GET_CHANNEL, exception).log(this.logger)
      return null
    }
  }

  async closeChannel() {
    try {
      if (this.channel) {
        await this.channel?.close()
        this.channel = null
      }
    } catch (exception: any) {
      new iKomidaError(iKomidaError.MQ_CLOSE_CHANNEL, exception).log(this.logger)
    }
  }

  async close() {
    await this.closeChannel()
    if (this.connection) {
      await this.connection?.close()
    }
  }

  async publish<T extends Types.TAMQPPayload>(queue: string, payload: Classes.CAMQPPayload<T>) {
    try {
      const channel = await this.getChannel(queue)
      const result = await channel?.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        persistent: true
      })
      await this.closeChannel()
      return result
    } catch (exception: any) {
      new iKomidaError(iKomidaError.MQ_PUBLISH, exception).log(this.logger)
      return null
    }
  }

  async listenToMessages(queue: string, callback: (message: ConsumeMessage, channel: Channel) => void) {
    try {
      const channel = await this.getChannel(queue, true)
      this.logger.log(' [*] Waiting for messages. To exit press CTRL+C')
      return channel?.consume(
        queue,
        async (message: ConsumeMessage | null) => {
          try {
            if (message) {
              await callback(message, channel)
            }
          } catch (e) {
            this.logger.error(e)
          }
        },
        {
          noAck: false
        }
      )
    } catch (exception: any) {
      new iKomidaError(iKomidaError.MQ_LISTEN_TO_MESSAGES, exception).log(this.logger)
      return null
    }
  }
}
