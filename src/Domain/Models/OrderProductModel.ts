import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import OrderModel from './OrderModel.js'
import OrderProductOptionModel from './OrderProductOptionModel.js'
import ProductModel from './ProductModel.js'
import UserModel from './UserModel.js'

@Table({
  paranoid: true,
  modelName: 'orderProduct'
})
export default class OrderProductModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys())
  })
  discountType?: Types.TDiscount
  @Column(DataType.INTEGER)
  price?: number
  @Column(DataType.INTEGER)
  discount?: number
  @Column(DataType.INTEGER)
  quantity?: number
  @Column({
    type: DataType.CHAR({ length: 255 })
  })
  observation?: string

  //MARK: -- Associations
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

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string
  @BelongsTo(() => ProductModel)
  product?: ProductModel

  @HasMany(() => OrderProductOptionModel)
  orderProductOptions?: OrderProductOptionModel[]
}
