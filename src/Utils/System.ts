import Return from './Return'
import { Finances } from '@ikomida/shared-logics'
import { Request, NextFunction, Express, Response } from 'express'
import { IiKomidaError } from './iKomidaError'

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
        if (data && (data as Return<T>)?.status && !isNaN(Number((data as Return<T>)?.status))) {
          this.status((data as Return<T>)?.status ?? 0)
          delete (data as Return<T>).status
        }
        this.type('json')
        this.end(
          data && data instanceof Return && 'toString' in (data as Return<T>)
            ? (data as Return<T>).toString()
            : JSON.stringify(data)
        )
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
    Finances.toNumber(areaCode) === Finances.toNumber('55') &&
    Finances.toNumber(phone) === Finances.toNumber('11922221111')
  )
}
