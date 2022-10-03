import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import OrderModel from './OrderModel';
import OrderProductProductOptionModel from './OrderProductProductOptionModel';
import ProductModel from './ProductModel';
import ProductOptionModel from './ProductOptionModel';
import UserModel from './UserModel';

@Table({
  paranoid: true,
  modelName: 'orderProduct',
})
export default class OrderProductModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string;
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys()),
  })
  discountType?: Types.TDiscount;
  @Column(DataType.INTEGER)
  price?: number;
  @Column(DataType.INTEGER)
  discount?: number;
  @Column(DataType.INTEGER)
  quantity?: number;

  //MARK: --Associations
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string;
  @BelongsTo(() => UserModel)
  user?: UserModel;

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @ForeignKey(() => OrderModel)
  @Column(DataType.UUID)
  orderId?: string;
  @BelongsTo(() => OrderModel)
  order?: OrderModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string;
  @BelongsTo(() => ProductModel)
  product?: ProductModel;

  @BelongsToMany(() => ProductOptionModel, () => OrderProductProductOptionModel)
  productOptions?: ProductOptionModel[]
}
