import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import OrderModel from './OrderModel.js'
import UserCreditCardModel from './UserCreditCardModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'

@Table({
  paranoid: true,
  modelName: 'userPayment'
})
export default class UserPaymentModel extends BaseModel {
  @Column({
    type: DataType.ENUM(...Types.TPagSeguroPaymentStatus.keys())
  })
  status?: Types.TPagSeguroPaymentStatus
  @Column(DataType.STRING(50))
  gateway?: string
  @Column(DataType.STRING(20))
  brand?: string
  @Column(DataType.STRING({ length: 6 }))
  firstDigits?: string
  @Column(DataType.STRING({ length: 4 }))
  lastDigits?: string
  @Column(DataType.TEXT)
  gatewayPaymentID?: string
  @Column
  amount?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string
  @BelongsTo(() => UserModel)
  user?: UserModel

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @ForeignKey(() => OrderModel)
  @Column(DataType.UUID)
  orderId?: string
  @BelongsTo(() => OrderModel)
  order?: OrderModel

  @ForeignKey(() => UserCreditCardModel)
  @Column(DataType.UUID)
  userCreditCardId?: number
  @BelongsTo(() => UserCreditCardModel)
  userCreditCard?: UserCreditCardModel
}
