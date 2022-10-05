import { Table, Column, ForeignKey, DataType, HasOne, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import OrderModel from './OrderModel.js'
import OrderProductModel from './OrderProductModel.js'
import ProductOptionModel from './ProductOptionModel.js'

@Table({
  paranoid: true,
  modelName: 'orderProductOption'
})
export default class OrderProductOptionModel extends BaseModel {
  @Column(DataType.CHAR(100))
  name?: string

  @Column(DataType.INTEGER)
  price?: number

  @Column(DataType.INTEGER)
  units?: number

  //MARK: -- associations
  @ForeignKey(() => OrderModel)
  @Column(DataType.UUID)
  orderId?: string

  @BelongsTo(() => OrderModel)
  order?: OrderModel

  @ForeignKey(() => OrderProductModel)
  @Column(DataType.UUID)
  orderProductId?: string

  @BelongsTo(() => OrderProductModel)
  orderProduct?: OrderProductModel

  @ForeignKey(() => ProductOptionModel)
  @Column(DataType.UUID)
  productOptionId?: string

  @BelongsTo(() => ProductOptionModel)
  productOption?: ProductOptionModel
}
