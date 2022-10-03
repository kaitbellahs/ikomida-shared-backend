import { Table, Column, ForeignKey, DataType } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import OrderModel from './OrderModel';
import OrderProductModel from './OrderProductModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'orderProductProductOption',
})
export default class OrderProductProductOptionModel extends BaseModel {
  @ForeignKey(() => OrderProductModel)
  @Column(DataType.UUID)
  orderProductId?: string

  @ForeignKey(() => ProductOptionModel)
  @Column(DataType.UUID)
  productOptionId?: string
}
