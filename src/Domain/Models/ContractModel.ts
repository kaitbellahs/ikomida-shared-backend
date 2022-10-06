import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript'
import AddressModel from './AddressModel.js'
import AppModel from './AppModel.js'
import BaseModel from './BaseModel.js'
import ContractPaymentSignatureModel from './ContractPaymentSignatureModel.js'
import CouponModel from './CouponModel.js'
import OrderModel from './OrderModel.js'
import PlanModel from './PlanModel.js'
import ReferralModel from './ReferralModel.js'
import TermHashModel from './TermHashModel.js'
import UserCreditCardModel from './UserCreditCardModel.js'
import UserModel from './UserModel.js'
import UserPaymentModel from './UserPaymentModel.js'
import VendorPNMessageModel from './VendorPNMessageModel.js'
import PNMessageModel from './PNMessageModel.js'
import OrderProductModel from './OrderProductModel.js'
import ProductCategoryModel from './ProductCategoryModel.js'
import ProductModel from './ProductModel.js'
import PNModel from './PNModel.js'
import PhoneValidationCodeModel from './PhoneValidationCodeModel.js'
import VendorPaymentGatewayModel from './VendorPaymentGatewayModel.js'
import VendorSettingsModel from './VendorSettingsModel.js'
import ContractPaymentModel from './ContractPaymentModel.js'
import { Types } from '@ikomida/shared-types'
import ProductOptionsCategoryModel from './ProductOptionsCategoryModel.js'
import ProductOptionModel from './ProductOptionModel.js'

@Table({
  paranoid: true,
  modelName: 'contract'
})
export default class ContractModel extends BaseModel {
  @Column(DataType.STRING(255))
  ikomidaID?: string
  @Column(DataType.STRING(100))
  contractName?: string
  @Column(DataType.STRING(25))
  contractIdentity?: string
  @Column(DataType.STRING(255))
  email?: string
  @Column({
    type: DataType.ENUM(...Types.TAsaasSignatureStatus.keys())
  })
  status?: Types.TAsaasSignatureStatus
  @Column(DataType.STRING(30))
  name?: string
  @Column(DataType.STRING(50))
  lastName?: string
  @Column(DataType.STRING(20))
  identity?: string
  @Column(DataType.INTEGER({ length: 3 }))
  areaCode?: number
  @Column(DataType.STRING(20))
  phone?: string
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  lastOrderCustomID?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @HasOne(() => ContractPaymentSignatureModel)
  contractPaymentSignature?: ContractPaymentSignatureModel

  @HasOne(() => VendorSettingsModel)
  vendorSettings?: VendorSettingsModel

  @HasOne(() => VendorPaymentGatewayModel)
  vendorPaymentGateway?: VendorPaymentGatewayModel

  @HasMany(() => AppModel)
  apps?: AppModel[]

  @HasMany(() => UserPaymentModel)
  userPayments?: UserPaymentModel[]

  @HasMany(() => UserModel)
  users?: UserModel[]

  @HasMany(() => ContractPaymentModel)
  contractPayments?: ContractPaymentModel[]

  @HasMany(() => PNModel)
  pNs?: PNModel[]

  @HasMany(() => UserCreditCardModel)
  userCreditCards?: UserCreditCardModel[]

  @HasMany(() => CouponModel)
  coupons?: CouponModel[]

  @HasMany(() => ProductModel)
  products?: ProductModel[]

  @HasMany(() => OrderModel)
  orders?: OrderModel[]

  @HasMany(() => ProductCategoryModel)
  productCategories?: ProductCategoryModel[]

  @HasMany(() => ProductOptionsCategoryModel)
  productOptionsCategories?: ProductOptionsCategoryModel[]

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[]

  @HasMany(() => OrderProductModel)
  orderProducts?: OrderProductModel[]

  @HasMany(() => VendorPNMessageModel)
  vendorPNMessages?: VendorPNMessageModel[]

  @HasMany(() => TermHashModel)
  termHashs?: TermHashModel[]

  @HasMany(() => PNMessageModel)
  pNMessages?: PNMessageModel[]

  @HasMany(() => PhoneValidationCodeModel)
  phoneValidationCodes?: PhoneValidationCodeModel[]

  @HasMany(() => AddressModel)
  addresses?: AddressModel[]

  @ForeignKey(() => PlanModel)
  @Column(DataType.UUID)
  planId?: string
  @BelongsTo(() => PlanModel)
  plan?: PlanModel

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
}
