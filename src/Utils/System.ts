import * as Logics from '@ikomida/shared-logics'
import { Request, NextFunction, Express, Response } from 'express'
import Return from './Return.js'
import { IiKomidaError } from './iKomidaError.js'

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

declare module 'express-serve-static-core' {
  interface Response {
    sendResponse: (data: any) => Response
  }
}

export function setExpressResponse(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers?.identity) {
      try {
        req.headers.identity = JSON.parse(req.headers?.identity as string)
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    res.sendResponse = function <T extends any & IiKomidaError>(data: Return<T> | T): Response {
      try {
        if (!this?.statusCode) {
          this.status(200)
        }
        if (data instanceof Return && data.status && !isNaN(Number(data.status))) {
          this.status(data.status ?? 0)
          delete data.status
        }
        this.type('json')
        this.end(data instanceof Return ? data.toString() : JSON.stringify(data))
      } catch (exception: any) {
        console.error(new Date().toString(), 'exception:', exception)
        this.type('json')
        this.status(500).end(
          new Return(
            false,
            'Ocorreu um erro interno nos serviços, tente de novo mais tarde, e se o erro persiste entre em contato com nosso suporte'
          ).toString()
        )
      }
      return this
    }
    next()
  })
}

export function isDemo(ikomidaID?: string, areaCode?: string | number, phone?: string | number) {
  return (
    ikomidaID === 'com.ikomida.br.demo' &&
    Logics.Finances.toNumber(areaCode) === Logics.Finances.toNumber('55') &&
    Logics.Finances.toNumber(phone) === Logics.Finances.toNumber('11922221111')
  )
}
