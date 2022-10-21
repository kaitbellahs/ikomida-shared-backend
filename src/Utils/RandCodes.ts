import { Classes } from '@ikomida/shared-types'

export default class RandCodes {
  count: number
  length: number
  charset: string
  prefix: string
  postfix: string
  pattern: string
  constructor(config?: Classes.CRandCode) {
    this.count = config?.count ?? 1
    this.length = config?.length ?? 8
    this.charset = config?.charset ?? this.charsets('alphanumeric')
    this.prefix = config?.prefix ?? ''
    this.postfix = config?.postfix ?? ''
    this.pattern = config?.pattern ?? this.repeat('#', this.length)
  }

  randomInt(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min + 1)) + min
  }

  randomElem(arr: string | any[]) {
    return arr[this.randomInt(0, arr.length - 1)]
  }

  charsets(name: string) {
    const charsetsList: Record<string, string> = {
      numbers: '0123456789',
      alphabetic: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      alphanumeric: `${new Date().getTime()}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`
    }
    return charsetsList[name]
  }

  repeat(str: string, count: number) {
    let res = ''
    for (let i = 0; i < count; i++) {
      res += str
    }
    return res
  }

  generateOne() {
    const code = this.pattern
      .split('')
      .map((char: string) => {
        if (char === '#') {
          return this.randomElem(this.charset)
        } else {
          return char
        }
      })
      .join('')
    return this.prefix + code + this.postfix
  }
}
