import { Table, Column, ForeignKey, DataType, HasOne, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import OrderModel from './OrderModel'
import OrderProductModel from './OrderProductModel'
import ProductOptionModel from './ProductOptionModel'

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
