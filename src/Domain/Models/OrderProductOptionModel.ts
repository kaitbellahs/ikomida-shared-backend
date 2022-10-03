import { Table, Column, ForeignKey, DataType } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import OrderModel from './OrderModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'orderProductOption',
})
export default class OrderProductOptionModel extends BaseModel {
  @ForeignKey(() => OrderModel)
  @Column(DataType.UUID)
  orderId?: string

  @ForeignKey(() => ProductOptionModel)
  @Column(DataType.UUID)
  productOptionId?: string
}
