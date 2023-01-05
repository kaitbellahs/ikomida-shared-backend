import * as Logics from '@ikomida/shared-logics'
import { Classes } from '@ikomida/shared-types'
import { Request, NextFunction, Express, Response } from 'express'
import { IiKomidaError } from './iKomidaError.js'

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

declare module 'express-serve-static-core' {
  interface Response {
    sendResponse: <T extends any & IiKomidaError>(
      data: Classes.Return<IiKomidaError> | Classes.Return<T> | T
    ) => Response
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
    res.sendResponse = function <T extends any & IiKomidaError>(
      data: Classes.Return<IiKomidaError> | Classes.Return<T> | T
    ): Response {
      try {
        if (!this?.statusCode) {
          this.status(200)
        }
        if (data instanceof Classes.Return && data.status && !isNaN(Number(data.status))) {
          this.status(data.status ?? 0)
          delete data.status
        }
        if (data instanceof Classes.Return && data.headers) {
          for (const key of Object.keys(data.headers)) {
            this.setHeader(key, data.headers[key] ?? '')
          }
          delete data.headers
        }
        this.type('json')
        this.end(data instanceof Classes.Return ? data.toString() : JSON.stringify(data))
      } catch (exception: any) {
        console.error(new Date().toString(), 'exception:', exception)
        this.type('json')
        this.status(500).end(
          new Classes.Return(
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
