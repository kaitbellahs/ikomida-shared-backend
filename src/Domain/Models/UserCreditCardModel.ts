import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'
import UserPaymentModel from './UserPaymentModel.js'
import OrderModel from './OrderModel.js'

@Table({
  paranoid: true,
  modelName: 'userCreditCard'
})
export default class UserCreditCardModel extends BaseModel {
  @Column(DataType.TEXT)
  token?: string
  @Column({
    type: DataType.ENUM(...Types.TPaymentMethod.keys())
  })
  type?: Types.TPaymentMethod
  @Column(DataType.STRING(20))
  brand?: string
  @Column(DataType.CHAR({ length: 6 }))
  firstDigits?: string
  @Column(DataType.CHAR({ length: 4 }))
  lastDigits?: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  selected?: boolean
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

  @HasMany(() => OrderModel)
  orders?: OrderModel[]

  @HasMany(() => UserPaymentModel)
  userPayments?: UserPaymentModel[]
}
