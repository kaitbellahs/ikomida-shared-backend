import { Interfaces } from '@ikomida/shared-types'
import http2, { ClientHttp2Session, OutgoingHttpHeaders } from 'http2'
import Logger from '../Utils/Logger.js'
export interface IHTTP2Response {
  status: number
  headers: Interfaces.IMetadata
  data: any
}
export default class HTTP2Client {
  host: string
  port: number
  http2Client?: ClientHttp2Session
  logger: Logger
  constructor(logger: Logger, host: string, port: number) {
    this.host = host
    this.port = port
    this.logger = logger
  }

  open() {
    this.http2Client = http2.connect(`${this.host}:${this.port}`)
    this.http2Client.on('error', error => this.logger.error(error))
  }

  isAlive() {
    return this.http2Client?.connecting
  }

  close() {
    this.http2Client?.close()
    this.http2Client = undefined
  }

  post(url: string, inHeaders: OutgoingHttpHeaders, body: any): Promise<IHTTP2Response> {
    const headers = {
      ...inHeaders,
      ':method': 'POST',
      ':path': url
    }
    return new Promise((resolve, reject) => {
      if (!this.isAlive()) {
        this.open()
      }
      const req = this.http2Client?.request(headers)
      if (req) {
        const localHeaders: Interfaces.IMetadata = {}
        req.on('response', responseHeaders => {
          for (const name in responseHeaders) {
            localHeaders[name] = `${responseHeaders[name]}`
          }
        })
        req.setEncoding('utf8')
        let data = ''
        req.on('data', chunk => {
          data += chunk
        })
        req.on('end', () => {
          const result: IHTTP2Response = {
            status: 0,
            headers: localHeaders,
            data
          }
          if (':status' in localHeaders) {
            result.status = Number(localHeaders[':status'])
          }
          resolve(result)
        })
        req.on('error', (error: any) => {
          reject(error)
        })
        req.write(JSON.stringify(body))
        req.end()
      } else {
        reject(new Error('http2Client not initialized'))
      }
    })
  }
}
