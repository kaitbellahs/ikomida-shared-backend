import { Types } from '@ikomida/shared-types'

export default class TPagseguroCharge extends Types.TBaseType {
  //MARK: -- Internal rules
  static BRAND_NOT_FOUND = new TPagseguroCharge('BRAND_NOT_FOUND')
  static INVALID_DATE = new TPagseguroCharge('INVALID_DATE')
  static INVALID_DATA = new TPagseguroCharge('INVALID_DATA')
  static INVALID_CARD_ID = new TPagseguroCharge('INVALID_CARD_ID')
  constructor(type: string) {
    super(type)
    switch (type) {
      case 'BRAND_NOT_FOUND':
        this.description = 'A bandeira do cartão digitado não é suportada'
        break
      case 'INVALID_DATE':
        this.description = ' A data de validade do cartão não é válida'
        break
      case 'INVALID_CARD_ID':
        this.description = ' O cartão não é válida'
        break
      default:
        this.description = 'Os dados do cartão encontram se inválidos'
        break
    }
  }
}
