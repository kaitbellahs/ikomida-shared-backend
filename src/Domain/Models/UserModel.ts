import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo, BeforeCount } from 'sequelize-typescript'
import PNMessageModel from './PNMessageModel'
import OrderProductModel from './OrderProductModel'
import PNModel from './PNModel'
import PhoneValidationCodeModel from './PhoneValidationCodeModel'
import ContractModel from './ContractModel'
import ReferralModel from './ReferralModel'
import UserInfoModel from './UserInfoModel'
import UserPIXKeyModel from './UserPIXKeyModel'
import UserPaymentModel from './UserPaymentModel'
import OrderModel from './OrderModel'
import AddressModel from './AddressModel'
import UserCreditCardModel from './UserCreditCardModel'
import TermHashModel from './TermHashModel'
import BaseModel from './BaseModel'
import AppModel from './AppModel'
import Roles from '../../Types/Roles'
import { Types } from '@ikomida/shared-types'

@Table({
  paranoid: true,
  modelName: 'user'
})
export default class UserModel extends BaseModel {
  @Column(DataType.TEXT)
  avatar?: string
  @Column({
    type: DataType.ENUM(...Roles.keys())
  })
  role?: Roles
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
