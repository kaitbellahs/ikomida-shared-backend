import { Table, Column, ForeignKey, DataType, HasOne } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import OrderModel from './OrderModel';
import ProductModel from './ProductModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'orderProductOption',
})
export default class OrderProductOptionModel extends BaseModel {
  @Column(DataType.CHAR(100))
  name?: string;

  @Column(DataType.INTEGER)
  price?: number;

  @Column(DataType.INTEGER)
  units?: number;

  //MARK: -- associations
  @ForeignKey(() => OrderModel)
  @Column(DataType.UUID)
  orderId?: string;

  @HasOne(() => OrderModel)
  order?: OrderModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string;

  @HasOne(() => ProductModel)
  product?: ProductModel;

  @ForeignKey(() => ProductOptionModel)
  @Column(DataType.UUID)
  productOptionId?: string;

  @HasOne(() => ProductOptionModel)
  productOption?: ProductOptionModel;
}
