import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript'
import AddressModel from './AddressModel.js'
import BaseModel from './BaseModel.js'
import CouponModel from './CouponModel.js'
import UserCreditCardModel from './UserCreditCardModel.js'
import UserModel from './UserModel.js'
import OrderProductModel from './OrderProductModel.js'
import ContractModel from './ContractModel.js'
import UserPaymentModel from './UserPaymentModel.js'
import OrderProductOptionModel from './OrderProductOptionModel.js'
import CGeometry from '../../Types/CGeometry.js'
import PosModel from './PosModel.js'
import OrdersGroupModel from './OrdersGroupModel.js'

@Table({
  paranoid: true,
  modelName: 'order'
})
export default class OrderModel extends BaseModel {
  @Column(DataType.INTEGER)
  customID?: number
  @Column({
    type: DataType.ENUM(...Types.TOrderStatus.keys())
  })
  status?: Types.TOrderStatus
  @Column(DataType.DATE)
  finishedAt?: Date
  @Column(DataType.INTEGER)
  subtotal?: number
  @Column(DataType.INTEGER)
  delivery?: number
  @Column(DataType.INTEGER)
  distance?: number
  @Column(DataType.INTEGER)
  duration?: number
  @Column(DataType.INTEGER)
  discount?: number
  @Column(DataType.GEOMETRY('POINT'))
  coordinates?: CGeometry
  @Column(DataType.INTEGER)
  preparationMin?: number
  @Column(DataType.INTEGER)
  preparationMax?: number
  @Column({
    type: DataType.ENUM(...Types.TPaymentMethod.keys())
  })
  paymentMethodType?: Types.TPaymentMethod
  @Column({
    type: DataType.STRING({ length: 255 })
  })
  observation?: string
  @Column({
    type: DataType.ENUM(...Types.TOrderType.keys())
  })
  orderType?: Types.TOrderType
  @Column(DataType.INTEGER)
  tip?: number
  @Column(DataType.STRING(50))
  table?: string
  @Column(DataType.INTEGER)
  change?: number

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

  @ForeignKey(() => UserCreditCardModel)
  @Column(DataType.UUID)
  userCreditCardId?: string
  @BelongsTo(() => UserCreditCardModel)
  userCreditCard?: UserCreditCardModel

  @ForeignKey(() => AddressModel)
  @Column(DataType.UUID)
  addressId?: string
  @BelongsTo(() => AddressModel)
  address?: AddressModel

  @ForeignKey(() => CouponModel)
  @Column(DataType.UUID)
  couponId?: string
  @BelongsTo(() => CouponModel)
  coupon?: CouponModel

  @ForeignKey(() => PosModel)
  @Column(DataType.UUID)
  posId?: string
  @BelongsTo(() => PosModel)
  pos?: PosModel

  @ForeignKey(() => OrdersGroupModel)
  @Column(DataType.UUID)
  ordersGroupId?: string
  @BelongsTo(() => OrdersGroupModel)
  ordersGroup?: OrdersGroupModel

  @HasOne(() => UserPaymentModel)
  userPayment?: UserPaymentModel

  @HasMany(() => OrderProductModel)
  orderProducts?: OrderProductModel[]

  @HasMany(() => OrderProductOptionModel)
  orderProductOptions?: OrderProductOptionModel[]

  @HasMany(() => PosModel)
  poses?: PosModel[]

  @HasMany(() => OrdersGroupModel)
  ordersGroups?: OrdersGroupModel[]
}
