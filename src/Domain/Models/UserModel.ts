import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript'
import PNMessageModel from './PNMessageModel.js'
import OrderProductModel from './OrderProductModel.js'
import PNModel from './PNModel.js'
import PhoneValidationCodeModel from './PhoneValidationCodeModel.js'
import ContractModel from './ContractModel.js'
import ReferralModel from './ReferralModel.js'
import UserInfoModel from './UserInfoModel.js'
import UserPIXKeyModel from './UserPIXKeyModel.js'
import UserPaymentModel from './UserPaymentModel.js'
import OrderModel from './OrderModel.js'
import AddressModel from './AddressModel.js'
import UserCreditCardModel from './UserCreditCardModel.js'
import TermHashModel from './TermHashModel.js'
import BaseModel from './BaseModel.js'
import AppModel from './AppModel.js'

@Table({
  paranoid: true,
  modelName: 'user'
})
export default class UserModel extends BaseModel {
  @Column(DataType.TEXT)
  avatar?: string
  @Column({
    type: DataType.ENUM(...Types.TRoles.keys())
  })
  role?: Types.TRoles
  @Column(DataType.STRING(30))
  name?: string
  @Column(DataType.STRING(50))
  lastName?: string
  @Column(DataType.STRING(255))
  email?: string
  @Column(DataType.STRING(20))
  identity?: string
  @Column(DataType.STRING(20))
  phone?: string
  @Column(DataType.INTEGER({ length: 3 }))
  areaCode?: number
  @Column(DataType.STRING(100))
  password?: string
  @Column(DataType.JSON)
  lastPasswords?: any
  @Column
  passwordUpdatedAt?: Date
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  updatePassword?: boolean
  @Column({
    type: DataType.ENUM(...Types.TPaymentMethod.keys())
  })
  paymentMethodType?: Types.TPaymentMethod
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: -- attributs
  ordersCount?: number
  ordersBilling?: number

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @ForeignKey(() => ReferralModel)
  @Column(DataType.UUID)
  referralId?: string
  @BelongsTo(() => ReferralModel)
  referral?: ReferralModel

  @ForeignKey(() => ReferralModel)
  @Column(DataType.UUID)
  referredById?: string
  @BelongsTo(() => ReferralModel)
  referredBy?: ReferralModel

  @HasMany(() => UserPIXKeyModel)
  userPIXKeys?: UserPIXKeyModel[]

  @HasMany(() => UserInfoModel)
  userInfos?: UserInfoModel[]

  @HasOne(() => TermHashModel)
  termHash?: TermHashModel

  @HasOne(() => PNModel)
  pN?: PNModel

  @HasMany(() => PNMessageModel)
  pNMessages?: PNMessageModel[]

  @HasMany(() => PhoneValidationCodeModel)
  phoneValidationCodes?: PhoneValidationCodeModel[]

  @HasMany(() => OrderProductModel)
  orderProducts?: OrderProductModel[]

  @HasMany(() => OrderModel)
  orders?: OrderModel[]

  @HasMany(() => AddressModel)
  addresses?: AddressModel[]

  @HasMany(() => UserCreditCardModel)
  userCreditCards?: UserCreditCardModel[]

  @HasMany(() => UserPaymentModel)
  userPayments?: UserPaymentModel[]

  @HasMany(() => AppModel)
  apps?: AppModel[]
}
